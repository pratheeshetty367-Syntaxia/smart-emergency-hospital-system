🏥 Smart Emergency Patient Queue System

A professional, full-stack triage management application designed to automate patient prioritization in emergency departments.

This system uses a custom algorithm to calculate a Priority Score (0-100) based on real-time vital signs, ensuring critical patients are seen first.

🚀 OverviewThe Problem: 
Traditional ER queues are often "first-come, first-served," which can be dangerous for critical patients.
The Solution: This app acts as a digital triage nurse, continuously monitoring vitals and dynamically re-ordering the queue based on medical urgency.
🛠️ Tech StackThis project uses the MDR Stack (MongoDB, Django, React):
Frontend: React.js for a live-updating dashboard.
Backend: Django REST Framework for robust API logic and the triage algorithm. 
Database: MongoDB for flexible, document-based patient data storage. 
API Client: Axios for seamless communication between frontend and backend
📋 FeaturesAutomated Triage: 
Priority scores and levels (Critical, High, Medium, Low) are calculated instantly upon admission . 
Live Vital Monitoring: The dashboard simulates real-time vital sign fluctuations for all patients in the queue. 
Statistical Dashboard: A StatsBar provides a quick overview of hospital load, categorized by urgency.  
Dynamic Sorting: The queue automatically sorts itself so the highest priority patients are always at the top.  
📂 Project StructureThe repository is organized into two main sections : 
/backend: Django configuration, patient models, and the priority algorithm . 
/frontend: React components, including the AdmitForm, PatientCard, and SuccessModal .  
⚙️ Installation & Setup
To run this project locally, follow these steps:

1. Prerequisites
Python 3.11+   
Node.js LTS   
MongoDB Community Server

3. Backend Setup
Bash
cd backend
python -m venv venv
venv\Scripts\activate  # Mac: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

4. Frontend Setup
Bash
cd frontend
npm install
npm start

📊 Priority AlgorithmThe system evaluates the following vitals to determine urgency : 
SpO2 (Oxygen): Scores up to 40 points for levels below 85%. 
Heart Rate: Alerts for tachycardia (>150 bpm) or bradycardia (<40 bpm).  
Systolic BP: Monitors for extreme hypertension or hypotension. 
GCS Score: Evaluates consciousness levels from 3 to 15.
