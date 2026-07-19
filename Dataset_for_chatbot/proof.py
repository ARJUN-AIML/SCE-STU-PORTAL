import os
import csv
import subprocess

BASE = os.path.dirname(os.path.abspath(__file__))

output = ["# Dataset Verification Proof\n"]

# 1. Directory tree & 2. CSV names & 5. Total files & 10. Confirm exists
output.append("## 1. Directory Tree & Total Files\n")
output.append("```text")
total_files = 0
csv_files = []
for root, dirs, files in os.walk(BASE):
    if ".git" in root or "__pycache__" in root: continue
    level = root.replace(BASE, '').count(os.sep)
    indent = ' ' * 4 * (level)
    output.append(f"{indent}- {os.path.basename(root) or 'Dataset_for_chatbot'}/")
    subindent = ' ' * 4 * (level + 1)
    for f in files:
        if f.endswith('.csv'):
            output.append(f"{subindent}- {f}")
            total_files += 1
            csv_files.append(os.path.relpath(os.path.join(root, f), BASE))
output.append("```\n")
output.append(f"**Total CSV files generated:** {total_files}\n")
output.append(f"**All 39 expected CSVs exist:** {'Yes' if total_files == 39 else 'No'}\n")

# 6. Verify dataset output
output.append("## 6. Output of verify_dataset.py\n")
output.append("```text")
try:
    res = subprocess.run(["python", "verify_dataset.py"], capture_output=True, text=True)
except Exception:
    res = subprocess.run(["py", "verify_dataset.py"], capture_output=True, text=True)
output.append(res.stdout)
output.append("```\n")

# 7, 8, 9. Extract numbers from verify output
fk_errors = 0
pk_dupes = 0
warnings = 0
for line in res.stdout.split('\n'):
    if "foreign key resolution errors" in line:
        fk_errors = int(line.split(' ')[2])
    if "duplicate PK" in line:
        pk_dupes += 1
    if "[WARN]" in line:
        warnings += 1

output.append(f"**7. Foreign Key Errors:** {fk_errors}\n")
output.append(f"**8. Duplicate Primary Keys:** {pk_dupes}\n")
output.append(f"**9. Warnings Encountered:** {warnings}\n")

# 3. Row counts & 4. Sample rows
output.append("## 3 & 4. Row Counts and Sample Data (First 5 rows)\n")
for rel_path in sorted(csv_files):
    path = os.path.join(BASE, rel_path)
    with open(path, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        rows = list(reader)
        row_count = len(rows) - 1 if len(rows) > 0 else 0
        output.append(f"### {rel_path.replace(os.sep, '/')} ({row_count} rows)\n")
        output.append("```csv")
        for r in rows[:6]:
            # limit very long rows for brevity
            r = [c[:50] + '...' if len(c) > 50 else c for c in r]
            output.append(','.join(r))
        output.append("```\n")

out_path = os.path.join(BASE, "proof_output.md")
with open(out_path, "w", encoding="utf-8") as out:
    out.write('\n'.join(output))

print(f"Proof written to {out_path}")
