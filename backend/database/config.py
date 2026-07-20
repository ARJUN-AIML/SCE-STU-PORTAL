import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

def get_engine(url):
    if not url or url.startswith("sqlite"):
        fallback_url = url or "sqlite:///./campus.db"
        return create_engine(
            fallback_url,
            connect_args={"check_same_thread": False},
        )
    
    # Handle legacy postgres:// URLs
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
        
    # Ensure sslmode=require for Neon PostgreSQL
    if "neon.tech" in url and "sslmode=require" not in url:
        separator = "&" if "?" in url else "?"
        url += f"{separator}sslmode=require"
        
    return create_engine(
        url,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=300,
    )

engine = get_engine(DATABASE_URL)

try:
    # Test connection
    with engine.connect() as conn:
        pass
    logger.info("Successfully connected to primary database.")
except Exception as e:
    if os.getenv("DATABASE_URL") and "sqlite" not in os.getenv("DATABASE_URL"):
        logger.error(f"Failed to connect to primary database. Not falling back to SQLite in production. Error: {e}")
        raise e
    else:
        logger.warning(f"Failed to connect to primary database. Falling back to SQLite. Error: {e}")
        # Fallback to SQLite
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
