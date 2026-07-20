import os
from sqlalchemy import create_engine, text

engine = create_engine(os.getenv("DATABASE_URL", "postgresql+psycopg://user:pass@ep-cold-shadow-1234.us-east-2.aws.neon.tech/sce_portal?sslmode=require"))
with engine.connect() as conn:
    routes = conn.execute(text("SELECT * FROM transport_routes")).fetchall()
    print("--- ROUTES IN DB ---")
    for r in routes:
        print(r)
