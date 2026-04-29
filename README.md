# 🏥 Smart Emergency Patient Queue System

[cite_start]A professional, full-stack triage management application designed to automate patient prioritization in emergency departments[cite: 1, 4]. [cite_start]This system uses a custom algorithm to calculate a **Priority Score (0-100)** based on real-time vital signs, ensuring critical patients are seen first [cite: 165-171, 1117].

---

## 🚀 Overview
* **The Problem:** Traditional ER queues are often "first-come, first-served," which can be dangerous for critical patients.
* [cite_start]**The Solution:** This app acts as a digital triage nurse, using React to display a live dashboard, Django to handle the logic, and MongoDB to store patient data [cite: 5-8].

## 🛠️ Tech Stack
* [cite_start]**Frontend:** React.js for the user interface and live-updating dashboard[cite: 5, 361].
* [cite_start]**Backend:** Django REST Framework for API logic and the triage algorithm[cite: 6, 70].
* [cite_start]**Database:** MongoDB for flexible, document-based storage[cite: 7, 71].
* [cite_start]**API Client:** Axios for communication between React and Django[cite: 366, 377].

## 📋 Features
* [cite_start]**Automated Triage:** Instantly calculates priority scores and levels (Critical, High, Medium, Low) upon admission [cite: 230-237, 270-283].
* [cite_start]**Live Vital Monitoring:** Simulates real-time vital sign fluctuations to demonstrate dynamic queue re-sorting [cite: 459-475].
* [cite_start]**Interactive Dashboard:** A `StatsBar` provides a quick overview of hospital load, while `PatientCards` show detailed vitals[cite: 535, 674].
* [cite_start]**Success Modal:** Provides immediate feedback with a summary of the patient's triage status after admission [cite: 843-852].

## 📊 Priority Algorithm
[cite_start]The system evaluates several vital signs to determine urgency [cite: 165, 172-177]:
* [cite_start]**SpO₂ (Oxygen):** Adds up to 40 points if levels drop below 85% [cite: 180-181].
* [cite_start]**Heart Rate:** Monitors for dangerous extremes (tachycardia or bradycardia) [cite: 188-193].
* [cite_start]**Blood Pressure:** Evaluates Systolic BP to identify shock or hypertensive crisis [cite: 196-201].
* [cite_start]**GCS Score:** Incorporates the Glasgow Coma Scale to assess consciousness levels [cite: 218-225].

---

## ⚙️ Installation & Setup

### 1. Prerequisites
* [cite_start]**Python 3.11+** [cite: 10-12]
* [cite_start]**Node.js LTS** [cite: 18-19]
* [cite_start]**MongoDB Community Server** [cite: 25-26]

### 2. Backend Setup
1. [cite_start]**Navigate to the backend folder:** `cd backend` [cite: 54]
2. [cite_start]**Create a virtual environment:** `python -m venv venv` [cite: 55]
3. [cite_start]**Activate environment:** `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac) [cite: 57, 58]
4. [cite_start]**Install dependencies:** `pip install django djangorestframework djongo pymongo django-cors-headers dnspython` [cite: 62-67]
5. [cite_start]**Run migrations:** `python manage.py migrate` [cite: 355]
6. [cite_start]**Start server:** `python manage.py runserver` [cite: 356]

### 3. Frontend Setup
1. [cite_start]**Navigate to the frontend folder:** `cd frontend` [cite: 363]
2. [cite_start]**Install packages:** `npm install` [cite: 365]
3. [cite_start]**Launch the app:** `npm start` [cite: 1111]
4. [cite_start]**Access the Dashboard:** Open [http://localhost:3000](http://localhost:3000) in your browser[cite: 1113].

---

## 📂 Project Structure
* [cite_start]**backend/**: Contains the Django config, `patients` app, and triage logic [cite: 1151-1160].
* [cite_start]**frontend/**: Contains the React source code, API service, and UI components [cite: 1164-1172].

---
Created by **Pratheek Shetty** (Syntaxia)
