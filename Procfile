web: cd backend && python scripts/migrate_or_stamp.py && uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2 --proxy-headers --forwarded-allow-ips="*"
