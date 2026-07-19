import os
from sqlalchemy import create_engine, text

engine = create_engine('postgresql://postgres:welcome@localhost:5432/sce_portal')
with engine.connect() as conn:
    routes = conn.execute(text("SELECT * FROM transport_routes")).fetchall()
    print("--- ROUTES IN DB ---")
    for r in routes:
        print(r)
