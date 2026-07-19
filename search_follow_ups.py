import os
for root, dirs, files in os.walk(r'e:\CampusOS\backend'):
    if 'venv' in root or '__pycache__' in root:
        continue
    for file in files:
        if file.endswith('.py'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    if 'FOLLOW_UPS' in f.read():
                        print(path)
            except:
                pass
