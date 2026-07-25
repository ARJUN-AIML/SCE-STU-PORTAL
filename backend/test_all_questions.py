import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Fix Windows console encoding
sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from api import app

client = TestClient(app)

questions = [
    # 1. Faculty & HOD Details
    "Who is the HOD of AIML?",
    "Who is the HOD of CSE?",
    "Which professors teach in the Computer Science department?",
    "Where is the office room of Principal?",
    
    # 2. Transport & Bus Routes
    "Which bus route goes to Chatram Bus Stand?",
    "Which bus route goes to Thillai Nagar?",
    "What are the college bus timings in the morning and evening?",
    
    # 3. Events, Hackathons & Workshops
    "What events are scheduled for today?",
    "Are there any upcoming hackathons or coding contests?",
    "What technical workshops are happening this week?",
    "How do I register for an event or workshop?",
    
    # 4. Campus Timings & Navigation
    "What are the library timings and working hours?",
    "Is the library open right now?",
    "Is the canteen open right now?",
    "Where is the Administrative Block located?",
    
    # 5. Student Forms, Leave & Certificates
    "How do I apply for leave / sick leave?",
    "Can you draft a leave application email to my HOD?",
    "How do I request a Bonafide Certificate?",
    "I lost my college ID card, what should I do?",
    
    # 6. Clubs, Sports & Facilities
    "What student clubs are active on campus?",
    "How do I join the Coding Club?",
    "What sports facilities are available?",
    
    # 7. Notices, Placements & Policies
    "What are the latest placement notices?",
    "What is the minimum attendance policy for semester exams?",
    "How do I connect to campus WiFi?"
]

print("=========================================================")
print(f" TESTING {len(questions)} QUESTIONS AGAINST CHATBOT")
print("=========================================================\n")

passed = 0
failed = 0

for i, q in enumerate(questions, 1):
    resp = client.post("/chat", json={"question": q})
    if resp.status_code == 200:
        data = resp.json()
        answer = data.get("answer", "")
        sources = data.get("sources", [])
        clean_ans = answer.replace("\n", " ")[:140]
        print(f"[{i}/{len(questions)}] Q: '{q}'")
        print(f"    Answer: {clean_ans}...")
        print(f"    Sources: {sources}")
        if "don't have that information" in answer.lower():
            print(f"    [FAIL] Unanswered query!\n")
            failed += 1
        else:
            print(f"    [PASS] Answered successfully!\n")
            passed += 1
    else:
        print(f"[{i}/{len(questions)}] Q: '{q}' -> FAILED Status {resp.status_code}\n")
        failed += 1

print("=========================================================")
print(f" RESULTS: {passed} PASSED | {failed} FAILED / UNANSWERED")
print("=========================================================")
