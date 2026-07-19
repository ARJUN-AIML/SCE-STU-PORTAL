import csv
import random

routes_csv = r'e:\CampusOS\Dataset_for_chatbot\campus\transport_routes.csv'
stops_csv = r'e:\CampusOS\Dataset_for_chatbot\junction\transport_stops.csv'
profiles_csv = r'e:\CampusOS\Dataset_for_chatbot\core\student_profiles.csv'

new_routes = [
    {
        "id": "TR01",
        "name": "Bus 2 - KK Nagar",
        "vehicle": "bus",
        "desc": "Picks up from KK Nagar through Airport and Thuvakudi to Campus.",
        "stops": ["KK Nagar", "Sundar Nagar", "LIC Colony", "Kajamalai", "Airport", "Gundur", "HAPP", "Thuvakudi", "Saranathan College of Engineering"]
    },
    {
        "id": "TR02",
        "name": "Bus 18 - Thillai Nagar",
        "vehicle": "bus",
        "desc": "Covers Thillai Nagar, Cantonment, TVS Tolgate to Campus.",
        "stops": ["Thillai Nagar", "Tennur", "Cantonment", "TVS Tolgate", "Saranathan College of Engineering"]
    },
    {
        "id": "TR03",
        "name": "Van 1 - Thanjavur",
        "vehicle": "van",
        "desc": "Express Van from Thanjavur via NIT Trichy.",
        "stops": ["Thanjavur", "Vallam", "Sengipatti", "NIT Trichy", "Thuvakudi", "Saranathan College of Engineering"]
    },
    {
        "id": "TR04",
        "name": "Bus 21 - Srirangam",
        "vehicle": "bus",
        "desc": "Covers Srirangam, Chatram Bus Stand, Palakkarai to Campus.",
        "stops": ["Srirangam", "Thiruvanaikoil", "Chatram Bus Stand", "Main Guard Gate", "Palakkarai", "Saranathan College of Engineering"]
    }
]

# Write routes
with open(routes_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['route_id', 'route_name', 'departure_time', 'arrival_time', 'return_time', 'fare', 'days_of_operation', 'vehicle_type', 'description'])
    for r in new_routes:
        writer.writerow([r['id'], r['name'], '07:00', '08:30', '16:30', '400', 'Mon-Sat', r['vehicle'], r['desc']])

# Write stops
with open(stops_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['route_id', 'stop_number', 'stop_name', 'pickup_time'])
    for r in new_routes:
        for i, stop in enumerate(r['stops']):
            # naive pickup time
            pickup = f"07:{str(i*10).zfill(2)}"
            writer.writerow([r['id'], i+1, stop, pickup])

# Update student profiles
with open(profiles_csv, 'r', newline='', encoding='utf-8') as f:
    reader = list(csv.reader(f))
    headers = reader[0]
    transport_idx = headers.index('transport_route_id')
    
    for row in reader[1:]:
        if row[transport_idx] and row[transport_idx].startswith('TR'):
            row[transport_idx] = random.choice(['TR01', 'TR02', 'TR03', 'TR04'])

with open(profiles_csv, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerows(reader)

print("Successfully replaced Chennai routes with Trichy routes in CSVs.")
