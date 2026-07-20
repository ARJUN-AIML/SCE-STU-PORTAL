import os
import csv

for root, dirs, files in os.walk(r'e:\SCE Student Portal'):
    # Skip virtual environments
    if 'venv' in root or 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.csv'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8-sig', errors='ignore') as f:
                    content = f.read()
                    if 'TR01' in content or 'Route' in content or 'bus' in content.lower():
                        print(f"--- MATCH IN: {path} ---")
                        # print first 3 lines
                        lines = content.split('\n')
                        for i in range(min(5, len(lines))):
                            print(lines[i])
            except Exception as e:
                pass
