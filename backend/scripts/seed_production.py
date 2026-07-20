import sys
import logging
from pathlib import Path
import os

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def main():
    # Ensure this is executed from the backend directory
    backend_dir = Path(__file__).parent.parent
    os.chdir(backend_dir)
    sys.path.insert(0, str(backend_dir))
    
    logger.info("Starting Production Database Seeding...")
    logger.info("Make sure you are running this against your production Neon PostgreSQL database!")
    
    try:
        logger.info("--- Step 1: Base Data (Events, Clubs, Notices, Buildings) ---")
        import seed
        seed.seed_database()
        
        logger.info("--- Step 2: Realistic Faculty & Departments ---")
        import seed_faculty
        seed_faculty.seed()
        
        logger.info("--- Step 3: Transport Routes ---")
        import seed_transport
        seed_transport.seed()
        
        logger.info("✅ All production tables successfully seeded!")
        
    except Exception as e:
        logger.error(f"❌ Seeding failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
