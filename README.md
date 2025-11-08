# Breathe Right AI - Lung Health Monitoring System

A full-stack web application for monitoring lung health with separate dashboards for Patients and Doctors.

## Project Structure

- `frontend/` - React application built with Vite
- `backend/` - Flask REST API with mock data

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## Features

- **Role-Based Authentication**: Login for Patients and Doctors
- **Patient Dashboard**: Daily health input, progress charts, emergency alerts, report generation
- **Doctor Dashboard**: View all patients and their health logs
- **AI Chatbot**: Basic chat interface (stub implementation)

## Default Accounts

Check `backend/models.py` for sample user accounts and credentials.

