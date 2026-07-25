import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

import time

DATABASE_URL = os.getenv("DATABASE_URL")

def normalize_database_url(url: str) -> str:
    if not url:
        return url
    # Handle legacy postgres:// URLs
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    # Ensure sslmode=require for Neon / production PostgreSQL if not specified
    if (url.startswith("postgresql") or "neon.tech" in url) and "sslmode=" not in url:
        separator = "&" if "?" in url else "?"
        url += f"{separator}sslmode=require"
    return url

def get_engine(url):
    if not url or url.startswith("sqlite"):
        fallback_url = url or "sqlite:///./campus.db"
        return create_engine(
            fallback_url,
            connect_args={"check_same_thread": False},
        )
    
    normalized_url = normalize_database_url(url)
    
    connect_args = {
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    }
        
    return create_engine(
        normalized_url,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        pool_pre_ping=True,
        pool_recycle=180,
        connect_args=connect_args,
    )

engine = get_engine(DATABASE_URL)

def verify_connection(eng, max_retries=5, delay=1.5):
    """Test connection with retry mechanism for serverless compute cold starts (Neon)."""
    last_err = None
    for attempt in range(1, max_retries + 1):
        try:
            with eng.connect() as conn:
                logger.info("Successfully connected to primary database.")
                return True
        except Exception as e:
            last_err = e
            logger.warning(f"Database connection attempt {attempt}/{max_retries} failed: {e}")
            if attempt < max_retries:
                time.sleep(delay)
    
    is_prod_db = os.getenv("DATABASE_URL") and not os.getenv("DATABASE_URL").startswith("sqlite")
    if is_prod_db:
        logger.error(f"Failed to connect to primary database after {max_retries} retries. Error: {last_err}")
        raise last_err
    else:
        logger.warning("Primary DB connection failed. Falling back to SQLite.")
        return False

# Attempt connection verification with retries
if not verify_connection(engine):
    DATABASE_URL = "sqlite:///./campus.db"
    engine = get_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

