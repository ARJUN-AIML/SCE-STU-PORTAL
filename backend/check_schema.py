import os
from dotenv import load_dotenv
from sqlalchemy import text
from database.config import SessionLocal

db = SessionLocal()
res = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'registrations'")).fetchall()
print('COLUMNS:')
for row in res:
    print(f'- {row[0]} ({row[1]})')

constrs = db.execute(text("SELECT conname, pg_get_constraintdef(c.oid) FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace WHERE conrelid = 'registrations'::regclass")).fetchall()
print('\nCONSTRAINTS:')
for row in constrs:
    print(f'- {row[0]}: {row[1]}')
