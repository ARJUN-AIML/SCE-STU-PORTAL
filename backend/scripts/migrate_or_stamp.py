import sys
import os
import logging
from pathlib import Path

# Ensure backend directory is in path and current working directory
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))
os.chdir(backend_dir)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

from database.config import engine, Base
import models.models
from alembic.config import Config
from alembic import command

def run_migration_or_stamp():
    alembic_cfg = Config("alembic.ini")
    try:
        logger.info("Attempting Alembic upgrade head...")
        command.upgrade(alembic_cfg, "head")
        logger.info("Alembic upgrade head completed successfully.")
    except Exception as e:
        logger.warning(f"Alembic upgrade encountered pre-existing tables or exception: {e}")
        try:
            logger.info("Stamping database revision to 'head'...")
            command.stamp(alembic_cfg, "head")
            logger.info("Successfully stamped database to head.")
        except Exception as stamp_err:
            logger.error(f"Failed to stamp database: {stamp_err}")
            
        try:
            logger.info("Ensuring all database tables exist via Base.metadata.create_all...")
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables verified.")
        except Exception as create_err:
            logger.error(f"Failed to create database tables: {create_err}")

if __name__ == "__main__":
    run_migration_or_stamp()
