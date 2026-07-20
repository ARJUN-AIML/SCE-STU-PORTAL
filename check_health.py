import urllib.request
import json
try:
    with urllib.request.urlopen("https://protective-balance-production-5b44.up.railway.app/health") as response:
        print(response.read().decode())
except Exception as e:
    print(e)
