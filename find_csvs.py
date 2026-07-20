import os

search_files = ['transport_routes.csv', 'transport_stops.csv', 'student_profiles.csv']

for root, dirs, files in os.walk(r'e:\SCE Student Portal'):
    for file in files:
        if file in search_files:
            print(os.path.join(root, file))
