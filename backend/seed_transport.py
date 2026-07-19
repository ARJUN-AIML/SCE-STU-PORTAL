import os
import sys

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from database.config import SessionLocal, engine
from models import models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_transport():
    db = SessionLocal()
    try:
        # Drop the existing table to update the schema
        models.TransportRoute.__table__.drop(engine, checkfirst=True)
        # Create table if missing
        models.Base.metadata.create_all(bind=engine)
        
        # Clear existing
        db.query(models.TransportRoute).delete()
        
        routes = [
            {
                "bus_id": "Bus 2",
                "route_name": "City Route A",
                "from_stop": "KK Nagar",
                "to_stop": "Saranathan College of Engineering",
                "final_destination": "Saranathan College of Engineering",
                "vehicle_type": "Bus",
                "stops": ["KK Nagar", "Sundar Nagar", "LIC Colony", "Kajamalai", "Airport", "Gundur", "HAPP", "Thuvakudi", "Saranathan College of Engineering"]
            },
            {
                "bus_id": "Bus 18",
                "route_name": "City Route B",
                "from_stop": "Thillai Nagar",
                "to_stop": "Saranathan College of Engineering",
                "final_destination": "Saranathan College of Engineering",
                "vehicle_type": "Bus",
                "stops": ["Thillai Nagar", "Tennur", "Cantonment", "TVS Tolgate", "Saranathan College of Engineering"]
            },
            {
                "bus_id": "Van 1",
                "route_name": "Express Van",
                "from_stop": "Thanjavur",
                "to_stop": "Saranathan College of Engineering",
                "final_destination": "Saranathan College of Engineering",
                "vehicle_type": "Van",
                "stops": ["Thanjavur", "Vallam", "Sengipatti", "NIT Trichy", "Thuvakudi", "Saranathan College of Engineering"]
            },
            {
                "bus_id": "Bus 21",
                "route_name": "Srirangam Route",
                "from_stop": "Srirangam",
                "to_stop": "Saranathan College of Engineering",
                "final_destination": "Saranathan College of Engineering",
                "vehicle_type": "Bus",
                "stops": ["Srirangam", "Thiruvanaikoil", "Chatram Bus Stand", "Main Guard Gate", "Palakkarai", "Saranathan College of Engineering"]
            }
        ]
        
        for r in routes:
            db.add(models.TransportRoute(**r))
            
        db.commit()
        logger.info(f"Seeded {len(routes)} transport routes successfully.")
        
    except Exception as e:
        logger.error(f"Error seeding transport: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_transport()
    
    # Sync with RAG
    try:
        from ai.transport_sync import sync_all_transport_to_chroma
        sync_all_transport_to_chroma()
    except Exception as e:
        logger.error(f"Failed to sync to RAG: {e}")
