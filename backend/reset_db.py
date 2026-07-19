from sqlalchemy import text
from database.config import engine
from models.models import Base

with engine.connect() as conn:
    conn.execute(text('DROP SCHEMA public CASCADE; CREATE SCHEMA public;'))
    conn.commit()

Base.metadata.create_all(bind=engine)
print("Database schema reset successfully")
