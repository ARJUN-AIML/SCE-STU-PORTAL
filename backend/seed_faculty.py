"""
Idempotent Faculty Directory Seed Script.
Populates PostgreSQL with realistic faculty for every department.
Then syncs lightweight summaries into ChromaDB for RAG.
"""
import random
import logging
from database.config import SessionLocal
from models.models import Department, Faculty

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# ======================================================================
# DEPARTMENTS
# ======================================================================
DEPARTMENTS = [
    {"name": "Computer Science and Engineering", "code": "CSE",
     "description": "The Department of CSE offers B.E. and M.E. programmes with a focus on software engineering, AI, and systems."},
    {"name": "Computer Science & Engineering (AI & ML)", "code": "AI & ML",
     "description": "Specialization in Artificial Intelligence and Machine Learning within Computer Science."},
    {"name": "Artificial Intelligence & Data Science", "code": "AI & DS",
     "description": "An interdisciplinary department focusing on data-driven intelligent systems."},
    {"name": "Computer Science & Business Systems", "code": "CSBS",
     "description": "Bridging the gap between computing technology and business strategy."},
    {"name": "Information Technology", "code": "IT",
     "description": "The Department of IT emphasizes networking, web technologies, and information security."},
    {"name": "Electronics and Communication Engineering", "code": "ECE",
     "description": "The Department of ECE covers VLSI, signal processing, communication systems, and embedded design."},
    {"name": "Electrical and Electronics Engineering", "code": "EEE",
     "description": "Power systems, control engineering, and renewable energy technologies."},
    {"name": "Instrumentation and Control Engineering", "code": "ICE",
     "description": "Specializing in industrial instrumentation, process control, and biomedical engineering."},
    {"name": "Mechanical Engineering", "code": "Mechanical",
     "description": "The Department of Mechanical Engineering covers thermal, design, manufacturing, and automotive engineering."},
    {"name": "Civil Engineering", "code": "Civil",
     "description": "Structural engineering, geotechnical engineering, environmental engineering, and construction management."},
    {"name": "MBA / Management Studies", "code": "MBA",
     "description": "Developing future business leaders with specializations in Finance, Marketing, and HR."},
    {"name": "Science & Humanities", "code": "S&H",
     "description": "Foundation department offering Mathematics, Physics, Chemistry, English and foundational sciences."},
]

# ======================================================================
# REALISTIC FACULTY DATA PER DEPARTMENT
# ======================================================================
# Each department gets a hand-curated list of faculty.
# Keys: name, designation, admin_role, qualification, specialization, email_prefix

FACULTY_DATA = {
    "CSE": [
        {"name": "Dr. R. Senthil Kumar", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Computer Science)", "specialization": "Artificial Intelligence"},
        {"name": "Dr. M. Anitha", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Computer Science)", "specialization": "Data Mining and Warehousing"},
        {"name": "Dr. S. Karthikeyan", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Information Technology)", "specialization": "Cloud Computing"},
        {"name": "Dr. P. Vijayalakshmi", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Computer Science)", "specialization": "Software Engineering"},
        {"name": "Dr. K. Ramesh Babu", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Computer Science)", "specialization": "Computer Networks"},
        {"name": "Ms. N. Priya", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Software Engineering)", "specialization": "Web Technologies"},
        {"name": "Mr. A. Dinesh Kumar", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Computer Science)", "specialization": "Operating Systems"},
        {"name": "Ms. R. Divya", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Computer Science)", "specialization": "Database Management Systems"},
        {"name": "Mr. V. Suresh", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Information Security)", "specialization": "Cyber Security"},
        {"name": "Ms. T. Kavitha", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Computer Science)", "specialization": "Image Processing"},
        {"name": "Mr. B. Arun Prasad", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Computer Science)", "specialization": "Machine Learning"},
        {"name": "Ms. G. Sangeetha", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Software Engineering)", "specialization": "Mobile Computing"},
        {"name": "Mr. J. Mohan Raj", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Data Science)", "specialization": "Big Data Analytics"},
        {"name": "Ms. L. Deepa", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Computer Science)", "specialization": "Natural Language Processing"},
    ],
    "AI & ML": [
        {"name": "Dr. V. Jayashree", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Artificial Intelligence)", "specialization": "Deep Learning"},
        {"name": "Dr. K. Srinivasan", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Machine Learning)", "specialization": "Reinforcement Learning"},
        {"name": "Dr. A. Lakshmi Priya", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Computer Science)", "specialization": "Computer Vision"},
        {"name": "Dr. N. Balaji", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (AI Systems)", "specialization": "Neural Networks"},
        {"name": "Dr. S. Preethi", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Data Analytics)", "specialization": "Predictive Analytics"},
        {"name": "Mr. R. Ganesh", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (AI)", "specialization": "Natural Language Processing"},
        {"name": "Ms. M. Saranya", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Machine Learning)", "specialization": "Generative AI"},
        {"name": "Mr. P. Venkat Raman", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Data Science)", "specialization": "Recommendation Systems"},
        {"name": "Ms. D. Harini", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (CSE - AI)", "specialization": "Robotics and Automation"},
        {"name": "Mr. T. Ashok Kumar", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Intelligent Systems)", "specialization": "Edge AI"},
        {"name": "Ms. K. Meenakshi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (AI)", "specialization": "Speech Recognition"},
        {"name": "Mr. S. Raghu", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (ML)", "specialization": "Transfer Learning"},
    ],
    "AI & DS": [
        {"name": "Dr. G. Nirmala", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Data Science)", "specialization": "Statistical Learning"},
        {"name": "Dr. T. Saravanan", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Computer Science)", "specialization": "Big Data Systems"},
        {"name": "Dr. R. Padmavathi", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Data Analytics)", "specialization": "Data Visualization"},
        {"name": "Dr. M. Kalaiselvi", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Statistics)", "specialization": "Bayesian Methods"},
        {"name": "Dr. A. Senthil Murugan", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Data Mining)", "specialization": "Time Series Analysis"},
        {"name": "Mr. V. Aravind", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Data Science)", "specialization": "Data Engineering"},
        {"name": "Ms. J. Swathi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (AI & DS)", "specialization": "Feature Engineering"},
        {"name": "Mr. K. Praveen", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Data Analytics)", "specialization": "Cloud Data Platforms"},
        {"name": "Ms. S. Janani", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Computer Science)", "specialization": "Text Analytics"},
        {"name": "Mr. R. Vignesh", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Data Science)", "specialization": "Business Intelligence"},
        {"name": "Ms. P. Bhuvaneswari", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (AI)", "specialization": "Graph Analytics"},
    ],
    "CSBS": [
        {"name": "Dr. S. Meenakshi Sundaram", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Computer Applications)", "specialization": "Business Analytics"},
        {"name": "Dr. P. Raghavan", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Information Systems)", "specialization": "Enterprise Systems"},
        {"name": "Dr. L. Geetha", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Computer Science)", "specialization": "Software Project Management"},
        {"name": "Dr. R. Sathish Kumar", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (IT Management)", "specialization": "IT Governance"},
        {"name": "Dr. B. Kannan", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Computer Science)", "specialization": "ERP Systems"},
        {"name": "Ms. V. Hema", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Software Engineering)", "specialization": "Agile Development"},
        {"name": "Mr. G. Manikandan", "designation": "Assistant Professor", "admin_role": None, "qualification": "MBA, M.Tech", "specialization": "Digital Transformation"},
        {"name": "Ms. K. Poornima", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Computer Science)", "specialization": "Cloud Business Solutions"},
        {"name": "Mr. N. Karthik", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (IT)", "specialization": "Blockchain Applications"},
        {"name": "Ms. A. Revathi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Computer Science)", "specialization": "Business Process Automation"},
    ],
    "IT": [
        {"name": "Dr. K. Shanmugam", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Information Technology)", "specialization": "Network Security"},
        {"name": "Dr. M. Rajkumar", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Computer Networks)", "specialization": "Wireless Sensor Networks"},
        {"name": "Dr. S. Sowmya", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Information Technology)", "specialization": "Information Retrieval"},
        {"name": "Dr. P. Kumaresan", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Networking)", "specialization": "Software Defined Networking"},
        {"name": "Dr. V. Suganya", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Web Technologies)", "specialization": "Service Oriented Architecture"},
        {"name": "Mr. R. Satheesh", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Information Technology)", "specialization": "Internet of Things"},
        {"name": "Ms. T. Bharathi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Computer Science)", "specialization": "Web Application Security"},
        {"name": "Mr. K. Anand", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (IT)", "specialization": "DevOps and CI/CD"},
        {"name": "Ms. G. Pavithra", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Cloud Computing)", "specialization": "Virtualization Technologies"},
        {"name": "Mr. B. Suresh Kumar", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Network Engineering)", "specialization": "Network Administration"},
        {"name": "Ms. M. Ramya", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Information Technology)", "specialization": "Human Computer Interaction"},
    ],
    "ECE": [
        {"name": "Dr. N. Sundararajan", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Electronics Engineering)", "specialization": "VLSI Design"},
        {"name": "Dr. M. Vasudevan", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Communication Engineering)", "specialization": "Wireless Communication"},
        {"name": "Dr. S. Revathi", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Signal Processing)", "specialization": "Digital Signal Processing"},
        {"name": "Dr. K. Mahalakshmi", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Embedded Systems)", "specialization": "Embedded System Design"},
        {"name": "Dr. P. Arulkumar", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Microelectronics)", "specialization": "Microwave Engineering"},
        {"name": "Ms. R. Shalini", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Communication Systems)", "specialization": "Antenna Design"},
        {"name": "Mr. T. Rajasekar", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (VLSI Design)", "specialization": "FPGA Development"},
        {"name": "Ms. V. Anuradha", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Electronics)", "specialization": "Biomedical Signal Processing"},
        {"name": "Mr. A. Subramaniam", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Communication Engineering)", "specialization": "Optical Communication"},
        {"name": "Ms. K. Nithya", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Applied Electronics)", "specialization": "Sensor Technology"},
        {"name": "Mr. D. Vinoth Kumar", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (ECE)", "specialization": "Image Processing"},
        {"name": "Ms. S. Gayathri", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Communication Systems)", "specialization": "5G Networks"},
        {"name": "Mr. G. Karthik Raja", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Signal Processing)", "specialization": "Radar Signal Processing"},
    ],
    "EEE": [
        {"name": "Dr. L. Balasubramanian", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Electrical Engineering)", "specialization": "Power Systems"},
        {"name": "Dr. S. Mythili", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Power Electronics)", "specialization": "Power Electronics and Drives"},
        {"name": "Dr. R. Thangavel", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Electrical Machines)", "specialization": "Electric Machine Design"},
        {"name": "Dr. P. Amudha", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Control Systems)", "specialization": "Industrial Control Systems"},
        {"name": "Dr. K. Rangaraj", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Renewable Energy)", "specialization": "Solar Energy Systems"},
        {"name": "Mr. V. Muthukumar", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Power Systems)", "specialization": "Smart Grid Technology"},
        {"name": "Ms. M. Sumathi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Power Electronics)", "specialization": "EV Charging Systems"},
        {"name": "Mr. T. Gopalakrishnan", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (High Voltage Engineering)", "specialization": "High Voltage Engineering"},
        {"name": "Ms. A. Jayanthi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Electrical Engineering)", "specialization": "Protection Systems"},
        {"name": "Mr. R. Senthil Rajan", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Power Electronics)", "specialization": "Motor Drive Systems"},
        {"name": "Ms. N. Dhanalakshmi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Control and Instrumentation)", "specialization": "PLC and SCADA"},
        {"name": "Mr. S. Balakrishnan", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Renewable Energy)", "specialization": "Wind Energy Systems"},
    ],
    "ICE": [
        {"name": "Dr. A. Ravi Shankar", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Instrumentation Engineering)", "specialization": "Process Control"},
        {"name": "Dr. M. Chandrasekaran", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Control Engineering)", "specialization": "Adaptive Control"},
        {"name": "Dr. K. Vasantha", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Biomedical Instrumentation)", "specialization": "Biomedical Engineering"},
        {"name": "Dr. S. Jeyakumar", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Industrial Automation)", "specialization": "Industrial Automation"},
        {"name": "Dr. R. Lakshmi Devi", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Instrumentation)", "specialization": "Virtual Instrumentation"},
        {"name": "Mr. P. Natarajan", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Instrumentation)", "specialization": "Sensor Networks"},
        {"name": "Ms. V. Deepa Lakshmi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Control Systems)", "specialization": "PID Controllers"},
        {"name": "Mr. K. Suresh Babu", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Process Control)", "specialization": "DCS Systems"},
        {"name": "Ms. T. Indira", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Biomedical Engineering)", "specialization": "Medical Imaging"},
        {"name": "Mr. G. Arun", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Instrumentation)", "specialization": "Calibration and Testing"},
        {"name": "Ms. R. Manjula", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (ICE)", "specialization": "MEMS Devices"},
    ],
    "Mechanical": [
        {"name": "Dr. V. Rajendran", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Mechanical Engineering)", "specialization": "Thermal Engineering"},
        {"name": "Dr. S. Murugesan", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Manufacturing Engineering)", "specialization": "Advanced Manufacturing"},
        {"name": "Dr. P. Krishna Murthy", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Design Engineering)", "specialization": "Finite Element Analysis"},
        {"name": "Dr. K. Baskaran", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Automotive Engineering)", "specialization": "Automotive Engineering"},
        {"name": "Dr. R. Uma Maheswari", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Industrial Engineering)", "specialization": "Industrial Engineering"},
        {"name": "Mr. T. Mohan Kumar", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Thermal Engineering)", "specialization": "Heat Transfer"},
        {"name": "Ms. A. Savitha", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (CAD/CAM)", "specialization": "CAD/CAM"},
        {"name": "Mr. M. Sathish", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Manufacturing)", "specialization": "CNC Programming"},
        {"name": "Ms. V. Priya Dharshini", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Design Engineering)", "specialization": "Product Design"},
        {"name": "Mr. K. Vijay Anand", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Thermal Engineering)", "specialization": "Refrigeration and AC"},
        {"name": "Mr. S. Ramachandran", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Mechanical)", "specialization": "Fluid Mechanics"},
        {"name": "Ms. P. Rajalakshmi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Production Engineering)", "specialization": "Quality Control"},
        {"name": "Mr. N. Surya Prakash", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Automotive)", "specialization": "Vehicle Dynamics"},
    ],
    "Civil": [
        {"name": "Dr. G. Mohan", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Civil Engineering)", "specialization": "Structural Engineering"},
        {"name": "Dr. S. Padmanabhan", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Geotechnical Engineering)", "specialization": "Geotechnical Engineering"},
        {"name": "Dr. R. Vasudevan", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Environmental Engineering)", "specialization": "Environmental Engineering"},
        {"name": "Dr. K. Manikandan", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Structural Engineering)", "specialization": "Concrete Technology"},
        {"name": "Dr. P. Latha", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Transportation Engineering)", "specialization": "Transportation Planning"},
        {"name": "Mr. M. Selvakumar", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Structural Engineering)", "specialization": "Steel Structures"},
        {"name": "Ms. V. Indumathi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Environmental Engineering)", "specialization": "Water Resources"},
        {"name": "Mr. T. Senthil Nathan", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Tech (Construction Management)", "specialization": "Construction Management"},
        {"name": "Ms. R. Gowri", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Structural Engineering)", "specialization": "Earthquake Engineering"},
        {"name": "Mr. A. Prabakaran", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.E. (Geotechnical Engineering)", "specialization": "Foundation Engineering"},
    ],
    "MBA": [
        {"name": "Dr. R. Muralidharan", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Management Studies)", "specialization": "Strategic Management"},
        {"name": "Dr. K. Hema Malini", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Finance)", "specialization": "Financial Management"},
        {"name": "Dr. S. Venkateswaran", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Marketing)", "specialization": "Digital Marketing"},
        {"name": "Dr. P. Jayalakshmi", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Human Resources)", "specialization": "Organizational Behavior"},
        {"name": "Dr. M. Arjun Rao", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Operations Management)", "specialization": "Supply Chain Management"},
        {"name": "Ms. A. Keerthana", "designation": "Assistant Professor", "admin_role": None, "qualification": "MBA (Finance)", "specialization": "Investment Analysis"},
        {"name": "Mr. T. Balamurugan", "designation": "Assistant Professor", "admin_role": None, "qualification": "MBA (Marketing)", "specialization": "Brand Management"},
        {"name": "Ms. R. Sridevi", "designation": "Assistant Professor", "admin_role": None, "qualification": "MBA (HR)", "specialization": "Talent Management"},
        {"name": "Mr. K. Rajkumar", "designation": "Assistant Professor", "admin_role": None, "qualification": "MBA (Operations)", "specialization": "Lean Management"},
        {"name": "Ms. V. Sangeetha Devi", "designation": "Assistant Professor", "admin_role": None, "qualification": "MBA (Finance)", "specialization": "Corporate Finance"},
    ],
    "S&H": [
        {"name": "Dr. M. Subramanian", "designation": "Professor", "admin_role": "HOD", "qualification": "Ph.D. (Mathematics)", "specialization": "Applied Mathematics"},
        {"name": "Dr. S. Lakshmi", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Physics)", "specialization": "Quantum Mechanics"},
        {"name": "Dr. V. Kamala", "designation": "Professor", "admin_role": None, "qualification": "Ph.D. (Chemistry)", "specialization": "Organic Chemistry"},
        {"name": "Dr. K. Radhika", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (English Literature)", "specialization": "Technical Communication"},
        {"name": "Dr. P. Shanmugapriya", "designation": "Associate Professor", "admin_role": None, "qualification": "Ph.D. (Mathematics)", "specialization": "Numerical Methods"},
        {"name": "Mr. R. Kathiravan", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Sc. (Mathematics)", "specialization": "Discrete Mathematics"},
        {"name": "Ms. T. Amala", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Sc. (Physics)", "specialization": "Solid State Physics"},
        {"name": "Mr. A. Venkatesan", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Sc. (Chemistry)", "specialization": "Inorganic Chemistry"},
        {"name": "Ms. M. Shalini", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.A. (English)", "specialization": "Communication Skills"},
        {"name": "Mr. K. Sundarraj", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Sc. (Mathematics)", "specialization": "Linear Algebra"},
        {"name": "Ms. S. Vasanthi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Sc. (Physics)", "specialization": "Optics and Photonics"},
        {"name": "Mr. V. Ganesh", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Sc. (Chemistry)", "specialization": "Analytical Chemistry"},
        {"name": "Ms. P. Jeyanthi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.A. (English)", "specialization": "Business English"},
        {"name": "Mr. R. Mohan Raj", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Sc. (Mathematics)", "specialization": "Probability and Statistics"},
        {"name": "Ms. G. Thenmozhi", "designation": "Assistant Professor", "admin_role": None, "qualification": "M.Sc. (Physics)", "specialization": "Electronics and Instrumentation"},
    ],
}


def make_email(name: str) -> str:
    """Generate a consistent email from a faculty name."""
    # Strip prefix
    clean = name.replace("Dr. ", "").replace("Mr. ", "").replace("Ms. ", "").replace("Mrs. ", "")
    parts = clean.strip().split()
    if len(parts) >= 2:
        # Use initial.lastname format
        first_initial = parts[0][0].lower()
        last = parts[-1].lower().replace(" ", "")
        return f"{first_initial}.{last}@sce.edu.in"
    return f"{parts[0].lower()}@sce.edu.in"


def seed():
    db = SessionLocal()
    try:
        # ── Step 1: Upsert Departments ──────────────────────────────
        dept_map = {}  # code -> Department ORM object
        for d_data in DEPARTMENTS:
            existing = db.query(Department).filter(Department.code == d_data["code"]).first()
            if existing:
                existing.name = d_data["name"]
                existing.description = d_data["description"]
                dept_map[d_data["code"]] = existing
                logger.info(f"Updated department: {d_data['name']}")
            else:
                new_dept = Department(
                    name=d_data["name"],
                    code=d_data["code"],
                    description=d_data["description"]
                )
                db.add(new_dept)
                db.flush()
                dept_map[d_data["code"]] = new_dept
                logger.info(f"Created department: {d_data['name']}")
        db.commit()

        # ── Step 2: Clear HOD references to avoid FK issues ─────────
        for dept in dept_map.values():
            dept.hod_id = None
        db.commit()

        # ── Step 3: Delete existing faculty per department ──────────
        for code, dept in dept_map.items():
            deleted = db.query(Faculty).filter(Faculty.department_id == dept.id).delete()
            if deleted:
                logger.info(f"Cleared {deleted} old faculty from {dept.name}")
        db.commit()

        # ── Step 4: Insert new faculty ──────────────────────────────
        room_idx = 101
        for code, dept in dept_map.items():
            faculty_list = FACULTY_DATA.get(code, [])
            if not faculty_list:
                logger.warning(f"No faculty data defined for {code}, skipping.")
                continue

            hod_faculty = None
            for f_data in faculty_list:
                email = make_email(f_data["name"])
                block = random.choice(["A", "B", "C", "D"])
                office = f"Block {block}-{room_idx}"
                room_idx += 1

                faculty = Faculty(
                    full_name=f_data["name"],
                    designation=f_data["designation"],
                    administrative_role=f_data["admin_role"],
                    email=email,
                    department_id=dept.id,
                    qualification=f_data["qualification"],
                    specialization=f_data["specialization"],
                    office_room=office,
                    image_url="",
                    expertise=[f_data["specialization"]],
                )
                db.add(faculty)
                db.flush()

                if f_data["admin_role"] == "HOD":
                    hod_faculty = faculty

            if hod_faculty:
                dept.hod_id = hod_faculty.id

            logger.info(f"✓ {dept.name}: {len(faculty_list)} faculty seeded (HOD: {hod_faculty.full_name if hod_faculty else 'NONE'})")

        db.commit()
        logger.info("Database seeding complete.")

        # ── Step 5: Sync ChromaDB ───────────────────────────────────
        logger.info("Syncing faculty summaries to ChromaDB...")
        try:
            from ai.llm import init_embeddings
            init_embeddings()
            
            from ai.retriever import init_vectorstore, get_vectorstore
            try:
                vs = get_vectorstore()
            except RuntimeError:
                init_vectorstore(force_rebuild=False)
                vs = get_vectorstore()

            from ai.faculty_sync import sync_all_faculty_to_chroma
            sync_all_faculty_to_chroma(db, vs)
            logger.info("✓ ChromaDB sync complete.")
        except Exception as e:
            logger.warning(f"ChromaDB sync failed (non-fatal): {e}")
            logger.info("Faculty data is still in PostgreSQL and will be available via direct DB queries.")

        # ── Step 6: Validation Report ───────────────────────────────
        logger.info("\n" + "=" * 60)
        logger.info("VALIDATION REPORT")
        logger.info("=" * 60)
        all_pass = True
        total_faculty = 0

        departments = db.query(Department).all()
        for dept in departments:
            count = db.query(Faculty).filter(Faculty.department_id == dept.id).count()
            total_faculty += count
            hod = db.query(Faculty).filter(Faculty.id == dept.hod_id).first() if dept.hod_id else None

            status = "✓" if count >= 10 else "✗"
            if count < 10:
                all_pass = False

            hod_name = hod.full_name if hod else "NOT ASSIGNED"
            logger.info(f"  {status} {dept.name} ({dept.code}): {count} faculty | HOD: {hod_name}")

        logger.info("-" * 60)
        logger.info(f"  Total Faculty: {total_faculty}")
        logger.info(f"  Total Departments: {len(departments)}")
        logger.info(f"  ALL PASS: {'YES' if all_pass else 'NO — some departments have < 10 faculty'}")
        logger.info("=" * 60)

    except Exception as e:
        logger.error(f"Seeding failed: {e}", exc_info=True)
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
