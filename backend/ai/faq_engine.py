"""
Semantic FAQ Engine with zero-LLM intent classification.
Uses cosine similarity on bge-small-en-v1.5 embeddings to match user queries
to known intents without any API calls.
"""
import json
import os
import logging
import numpy as np
from datetime import datetime, time as dt_time
from ai.llm import get_embeddings
from database.config import SessionLocal

logger = logging.getLogger(__name__)

SIMILARITY_THRESHOLD = 0.72


class FAQEngine:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        config_path = os.path.join(os.path.dirname(__file__), "faq_config.json")
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)

        self.intent_examples = []
        self.intent_keys = []
        for key, data in self.config["intents"].items():
            for ex in data.get("examples", []):
                self.intent_examples.append(ex.lower())
                self.intent_keys.append(key)

        self.example_embeddings = None
        self.example_norms = None
        logger.info(f"FAQ Engine instantiated with {len(self.intent_examples)} examples across {len(self.config['intents'])} intents")

    def _ensure_initialized(self):
        if self.example_embeddings is not None:
            return
        
        self.embeddings_model = get_embeddings()
        if self.embeddings_model is None:
            logger.warning("Embeddings unavailable. FAQ Engine semantic search disabled.")
            return

        try:
            self.example_embeddings = np.array(
                self.embeddings_model.embed_documents(self.intent_examples)
            )
            self.example_norms = np.linalg.norm(self.example_embeddings, axis=1)
            logger.info("FAQ Engine semantic embeddings initialized successfully.")
        except Exception as e:
            logger.error(f"FAQ Engine failed to initialize embeddings: {e}")
            self.example_embeddings = None
            self.example_norms = None

    def detect_intent(self, query: str) -> str | None:
        """Detect intent via cosine similarity. Returns intent key or None."""
        self._ensure_initialized()
        if self.embeddings_model is None or self.example_embeddings is None:
            return None
            
        q = query.lower().strip()
        if not q:
            return None

        query_vec = np.array(self.embeddings_model.embed_query(q))
        query_norm = np.linalg.norm(query_vec)
        if query_norm == 0:
            return None

        similarities = np.dot(self.example_embeddings, query_vec) / (self.example_norms * query_norm)
        best_idx = int(np.argmax(similarities))
        best_score = float(similarities[best_idx])

        if best_score >= SIMILARITY_THRESHOLD:
            matched = self.intent_keys[best_idx]
            logger.debug(f"FAQ match: '{q}' → {matched} (score={best_score:.3f})")
            return matched
        return None

    def get_response(self, intent_key: str) -> tuple[str, list[str]]:
        """Get response text and follow-ups for an intent."""
        intent_data = self.config["intents"].get(intent_key)
        if not intent_data:
            return "Sorry, I couldn't process that.", []

        follow_ups = intent_data.get("follow_ups", [])

        if "dynamic" in intent_data:
            return self._handle_dynamic(intent_data["dynamic"]), follow_ups

        return intent_data["response"], follow_ups

    def _handle_dynamic(self, dynamic_key: str) -> str:
        """Handle dynamic intents that need live data."""
        now = datetime.now().time()

        if dynamic_key == "library_hours":
            is_open = dt_time(9, 0) <= now <= dt_time(16, 45)
            return f"The Library is currently {'**open** ✅' if is_open else '**closed** 🔴'}. Hours: 9:00 AM – 4:45 PM (Mon–Fri)."

        if dynamic_key == "canteen_hours":
            is_open = dt_time(8, 40) <= now <= dt_time(17, 15)
            return f"The Canteen is currently {'**open** ✅' if is_open else '**closed** 🔴'}. Hours: 8:40 AM – 5:15 PM."

        # Database-backed dynamic intents
        db = SessionLocal()
        try:
            if dynamic_key == "today_events":
                from models.models import Event
                from sqlalchemy import func
                today = datetime.now().date()
                events = db.query(Event).filter(func.date(Event.date) == today).all()
                if not events:
                    return "There are no events scheduled for today."
                return "Today's events:\n" + "\n".join(f"• **{e.title}** — {e.venue or 'TBD'}" for e in events)

            if dynamic_key == "weekly_workshops":
                from models.models import Event
                workshops = db.query(Event).filter(Event.type.ilike("%workshop%"), Event.status == "open").all()
                if not workshops:
                    return "There are no workshops scheduled this week."
                return "Workshops this week:\n" + "\n".join(f"• **{e.title}** — {e.venue or 'TBD'}" for e in workshops)

            if dynamic_key == "upcoming_hackathons":
                from models.models import Event
                hackathons = db.query(Event).filter(
                    Event.type.ilike("%hackathon%"), Event.status == "open"
                ).all()
                if not hackathons:
                    return "There are no upcoming hackathons at the moment."
                return "Upcoming hackathons:\n" + "\n".join(f"• **{e.title}** — {e.date.strftime('%d %b %Y') if e.date else 'TBD'}" for e in hackathons)

            if dynamic_key == "open_competitions":
                from models.models import Event
                competitions = db.query(Event).filter(
                    Event.type.ilike("%competition%"), Event.status == "open"
                ).all()
                if not competitions:
                    return "There are no competitions currently open."
                return "Open competitions:\n" + "\n".join(f"• **{e.title}**" for e in competitions)

            if dynamic_key == "event_registration":
                return "You can register for open events through the **Events** section in the portal. If registration is closed, it will be indicated on the event card."

        except Exception as e:
            logger.error(f"Dynamic FAQ error for '{dynamic_key}': {e}")
            return "Sorry, I couldn't fetch that information right now. Please try again."
        finally:
            db.close()

        return "Information is currently unavailable."
