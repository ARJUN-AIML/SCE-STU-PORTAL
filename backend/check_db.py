import os, sys
import urllib.request, json
from sqlalchemy import create_engine, text

db_url = 'postgresql://neondb_owner:npg_W7oQsybaxIg8@ep-snowy-lab-az4podyq-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
engine = create_engine(db_url)

print('--- DB Counts (Neon) ---')
try:
    with engine.connect() as conn:
        for table in ['departments', 'faculty', 'events', 'transport']:
            res = conn.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
            print(f"{table}: {res}")
except Exception as e:
    print(f"DB Error: {e}")

print('\n--- Railway API Responses ---')
endpoints = ['events', 'faculty', 'departments', 'transport']
base_url = 'https://protective-balance-production-5b44.up.railway.app'
for ep in endpoints:
    try:
        req = urllib.request.Request(f"{base_url}/{ep}", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            print(f"/{ep} items count: {len(data.get('data', []))}")
            if len(data.get('data', [])) == 0:
                print(f"Raw JSON: {data}")
    except Exception as e:
        print(f"API Error on /{ep}: {e}")
