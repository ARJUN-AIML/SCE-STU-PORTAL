import os
import io
import time
import logging
import google.genai as genai
import google.genai.types as types
import cloudinary
import cloudinary.uploader
from models.models import Event

logger = logging.getLogger(__name__)

# Cloudinary configuration
cloudinary.config(
  cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
  api_key = os.getenv('CLOUDINARY_API_KEY'),
  api_secret = os.getenv('CLOUDINARY_API_SECRET')
)

# Gemini configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_CLIENT = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

MODEL_CANDIDATES = [
    "imagen-4.0-ultra-generate-001",
    "imagen-4.0-fast-generate-001",
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-lite-image",
    "gemini-3-pro-image",
]


def generate_dynamic_prompt(event: Event) -> str:
    """Generate a highly descriptive prompt for the event image."""
    title = event.title or "University Event"
    event_type = (event.type or "event").strip()
    category = (getattr(event, 'category', None) or "").strip()
    venue = (event.venue or "").strip()
    desc = event.description or ""

    # Build a rich contextual description using event metadata.
    title_lower = title.lower()
    desc_lower = desc.lower()
    category_lower = category.lower()
    event_key = event_type.lower()
    context = ""

    if "hackathon" in title_lower or "hackathon" in desc_lower or "hackathon" in category_lower:
        context = "Students collaborating during a university hackathon, futuristic technology, laptops, robotics, innovation, engineering campus"
    elif "symposium" in title_lower or "symposium" in desc_lower or "conference" in title_lower or "conference" in desc_lower:
        context = "Engineering students presenting technical research in a modern auditorium, innovation expo, conference atmosphere"
    elif "workshop" in title_lower or "workshop" in desc_lower or "workshop" == event_key:
        context = "Hands-on engineering workshop with students building electronics and coding, collaborative learning environment, professional educational setup"
    elif "sport" in title_lower or "sport" in desc_lower or "sports" in title_lower or "sports" in desc_lower or "sport" == event_key or "sports" == event_key:
        context = "University annual sports competition with athletes running, football, basketball, energetic campus atmosphere, vibrant colors"
    elif "cultural" in title_lower or "cultural" in desc_lower or "fest" in title_lower or "fest" in desc_lower or "cultural" == event_key:
        context = "College cultural festival with music, dance, stage lights, celebration, vibrant student crowd"
    else:
        context = f"Professional university {event_type} event with students, modern campus atmosphere"

    prompts = [context, f"{title}"]
    if category:
        prompts.append(f"Category: {category}")
    if venue:
        prompts.append(f"Venue: {venue}")

    # Ensure prompts are unique and grounded in event metadata.
    prompt_text = ", ".join(prompts)
    prompt_text += ", premium event banner, ultra realistic, cinematic lighting, photographic, 16:9, no text, no watermark, no typography"
    return prompt_text


def _generate_image_bytes(prompt: str, model_name: str) -> bytes:
    """Generate raw image bytes from the Gemini client using the best supported method."""
    if model_name.startswith("imagen"):
        result = GEMINI_CLIENT.models.generate_images(
            model=model_name,
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="16:9",
                output_mime_type="image/jpeg",
            ),
        )
        generated_images = getattr(result, 'generated_images', None)
        if not generated_images:
            raise ValueError("No images returned from Gemini image generation response")
        generated_image = generated_images[0]
        image_bytes = None
        if getattr(generated_image, 'image', None) is not None:
            image_bytes = getattr(generated_image.image, 'image_bytes', None)
        if image_bytes is None:
            image_bytes = getattr(generated_image, 'image_bytes', None)
        if image_bytes is None:
            raise ValueError(f"Could not extract image bytes from Gemini image generation response: {type(generated_image)}")
        return image_bytes

    # For Gemini models that support general content generation with image output.
    response = GEMINI_CLIENT.models.generate_content(
        model=model_name,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["image"],
            image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
        ),
    )
    candidates = getattr(response, 'candidates', None)
    if not candidates:
        raise ValueError("No candidates returned from Gemini content generation response")

    for candidate in candidates:
        if not candidate.content or not candidate.content.parts:
            continue
        for part in candidate.content.parts:
            if getattr(part, 'inline_data', None) and getattr(part.inline_data, 'data', None):
                return part.inline_data.data
            if getattr(part, 'file_data', None) and getattr(part.file_data, 'uri', None):
                raise ValueError("Gemini returned a file URI for image data, which is not supported by this upload flow")
    raise ValueError("Could not extract image bytes from Gemini content generation response")

from database.config import SessionLocal

def generate_and_upload_cover(event_id: int, max_retries=3):
    """
    Background worker function that generates the image, uploads it, and saves metadata.
    Implements retry, logging and ensures images are generated once.
    """
    db = SessionLocal()
    try:
        # Acquire the event row with a FOR UPDATE lock to avoid races
        event = db.query(Event).filter(Event.id == event_id).with_for_update(nowait=False).first()
        if not event:
            logger.error(f"Event {event_id} not found.")
            return

        # If already completed or processing, skip
        if event.image_generation_status in ["Completed", "Processing"]:
            logger.info(f"Event {event_id} already processing or completed (status={event.image_generation_status}).")
            return

        # Check GEMINI key early
        if not GEMINI_API_KEY:
            logger.error("GEMINI_API_KEY not set, cannot generate image.")
            event.image_generation_status = "Failed"
            db.commit()
            return

        # Mark as processing immediately to prevent duplicate generation
        event.image_generation_status = "Processing"
        db.commit()

        # Build prompt and persist for debugging
        prompt = generate_dynamic_prompt(event)
        event.image_prompt = prompt
        db.commit()

        logger.info(f"[Event:{event_id}] Prompt: {prompt}")

        success = False
        last_error = None

        for attempt in range(1, max_retries + 1):
            try:
                model_name = MODEL_CANDIDATES[attempt - 1] if attempt - 1 < len(MODEL_CANDIDATES) else MODEL_CANDIDATES[-1]
                logger.info(f"[Event:{event_id}] Generating image with model {model_name} (attempt {attempt}/{max_retries})")

                if not GEMINI_CLIENT:
                    raise RuntimeError("Gemini client is not configured")

                image_bytes = _generate_image_bytes(prompt, model_name)

                # Upload to Cloudinary
                logger.info(f"[Event:{event_id}] Uploading image to Cloudinary (attempt {attempt})")
                upload_result = cloudinary.uploader.upload(
                    io.BytesIO(image_bytes),
                    resource_type="image",
                    folder="campus_events",
                    public_id=f"event_{event.id}_cover_{int(time.time())}",
                    overwrite=False
                )

                # Persist metadata
                event.image_url = upload_result.get("secure_url")
                event.image_public_id = upload_result.get("public_id")
                event.image_generation_status = "Completed"
                db.commit()

                logger.info(f"[Event:{event_id}] Image generation completed and uploaded. public_id={event.image_public_id}")
                success = True
                break

            except Exception as e:
                last_error = e
                logger.exception(f"[Event:{event_id}] Attempt {attempt} failed: {str(e)}")
                # Exponential backoff with cap
                sleep_for = min(2 ** attempt, 10)
                time.sleep(sleep_for)

        if not success:
            logger.error(f"[Event:{event_id}] Failed to generate image after {max_retries} attempts. Last error: {last_error}")
            event.image_generation_status = "Failed"
            db.commit()

    finally:
        db.close()
