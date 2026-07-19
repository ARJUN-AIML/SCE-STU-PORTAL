import os
import csv

BASE = os.path.dirname(os.path.abspath(__file__))

# Let's read all 39 CSVs and check their row lengths against headers
expected_folders = ["core", "academic", "campus", "activities", "services", "reference", "junction"]

issues_found = False

for folder in expected_folders:
    folder_path = os.path.join(BASE, folder)
    if not os.path.exists(folder_path): continue
    for f in os.listdir(folder_path):
        if not f.endswith(".csv"): continue
        filepath = os.path.join(folder_path, f)
        with open(filepath, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            rows = list(reader)
            if not rows: continue
            header = rows[0]
            header_len = len(header)
            
            for i, row in enumerate(rows[1:], start=2):
                if len(row) != header_len:
                    print(f"[MALFORMED ROW] {folder}/{f} line {i}: expected {header_len} cols, got {len(row)}")
                    print(f"   Row: {row}")
                    issues_found = True
                    
                # Look for suspicious data, e.g., 'nonveg' in 'fee'
                for col_name, val in zip(header, row):
                    if "fee" in col_name.lower() and val == "nonveg":
                        print(f"[DATA ANOMALY] {folder}/{f} line {i}: col '{col_name}' has value '{val}'")
                        issues_found = True
                    if "eligibility" in col_name.lower() and val.isdigit() and int(val) == 500:
                        print(f"[DATA ANOMALY] {folder}/{f} line {i}: col '{col_name}' has value '{val}'")
                        issues_found = True

if not issues_found:
    print("No malformed rows or column shifts found based on basic heuristics!")
else:
    print("Issues detected!")
