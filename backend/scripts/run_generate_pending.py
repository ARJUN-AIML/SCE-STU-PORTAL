import os, sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
from dotenv import load_dotenv
load_dotenv()
from database.config import SessionLocal
from models.models import Event
from services.ai_image_service import generate_and_upload_cover
import time

if __name__ == '__main__':
    db = SessionLocal()
    events = db.query(Event).filter(Event.image_generation_status != 'Completed', Event.image_url == None).all()
    ids = [e.id for e in events]
    print('events_to_process', ids)
    db.close()

    for eid in ids:
        print('processing', eid)
        try:
            generate_and_upload_cover(eid, max_retries=3)
        except Exception as e:
            print('error on', eid, repr(e))
        # small pause to reduce burst to API
        time.sleep(1)

    # print final statuses
    db = SessionLocal()
    for e in db.query(Event).filter(Event.id.in_(ids)).all():
        print(e.id, e.title, e.image_generation_status, e.image_url)
    db.close()
