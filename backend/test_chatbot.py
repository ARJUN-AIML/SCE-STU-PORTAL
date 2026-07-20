import requests
import json
import time

URL = "https://protective-balance-production-5b44.up.railway.app/chat"

queries = [
    "How do I apply for leave?",
    "How to get a bonafide certificate?",
    "I lost my ID card, what should I do?",
    "What are the library timings?",
    "When is the canteen open?",
    "What events are happening?",
    "Are there any workshops?",
    "What is the airspeed velocity of an unladen swallow?",
    "Hi, how are you today?"
]

print("--- AI CHATBOT RUNTIME VALIDATION ---")
for q in queries:
    print(f"\n[Query]: {q}")
    start = time.time()
    try:
        response = requests.post(URL, json={"question": q})
        duration = time.time() - start
        if response.status_code == 200:
            data = response.json()
            print(f"[Response] ({duration:.2f}s): {data.get('response')[:200]}...")
        else:
            print(f"[Error] {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[Exception] {e}")
