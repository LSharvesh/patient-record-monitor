🩺 Patients and Doctors - web monitoring app

A full-stack healthcare management platform connecting patients and doctors through a simple, secure, and intelligent web interface.
Built with React (Vite) on the frontend and Flask (Python) on the backend.


---

📁 Project Structure
│
├── frontend/    → React (Vite) application
└── backend/     → Flask REST API with mock data


---

⚙️ Setup Instructions

🔹 Backend Setup

1. Navigate to the backend folder

cd backend


2. Create a virtual environment (recommended)

python -m venv venv


3. Activate the environment

Windows: venv\Scripts\activate

Mac/Linux: source venv/bin/activate



4. Install dependencies

pip install -r requirements.txt


5. Run the Flask server

python app.py

✅ Backend runs at: http://localhost:5000




---

🔹 Frontend Setup

1. Navigate to the frontend folder

cd frontend


2. Install dependencies

npm install


3. Start the development server

npm run dev

✅ Frontend runs at: http://localhost:3000




---

🌟 Key Features

🔐 Role-Based Authentication
Secure login system for both Patients and Doctors.

👩‍⚕️ Doctor Dashboard
View all registered patients, track their daily health updates, and monitor emergency alerts.

🧍 Patient Dashboard
Submit daily health inputs, visualize progress through interactive charts, and generate reports.

🤖 AI Chatbot (Preview)
A basic conversational interface for general health-related queries and guidance.



---

🧾 Default Accounts

Default credentials for testing are available in:
backend/models.py


---

🚀 Tech Stack

Frontend: React (Vite), HTML, CSS, JavaScript

Backend: Python (Flask), REST API

Database: Mock data (can be extended to SQL/NoSQL)



---

