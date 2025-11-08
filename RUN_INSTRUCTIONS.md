# How to Run Breathe Right AI

## Prerequisites
- Python 3.7+ installed
- Node.js and npm installed

## Step 1: Start the Backend (Flask API)

Open a terminal/PowerShell window:

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend will start on **http://localhost:5000**

You should see output like:
```
 * Running on http://127.0.0.1:5000
```

**Keep this terminal window open!**

---

## Step 2: Start the Frontend (React App)

Open a **NEW** terminal/PowerShell window:

```powershell
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:3000** (or another port if 3000 is busy)

You should see output like:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

**Keep this terminal window open too!**

---

## Step 3: Access the Application

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the login page

## Demo Accounts

### Patient Account:
- **Username:** `patient1`
- **Password:** `password123`

### Doctor Account:
- **Username:** `doctor1`
- **Password:** `doctor123`

---

## Troubleshooting

### Backend Issues:
- **Port 5000 already in use:** Change the port in `backend/app.py` (last line)
- **Module not found:** Make sure you activated the virtual environment and ran `pip install -r requirements.txt`
- **Python not found:** Make sure Python is installed and in your PATH

### Frontend Issues:
- **Port 3000 already in use:** Vite will automatically use the next available port
- **npm not found:** Make sure Node.js is installed
- **Dependencies not installing:** Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again

### Connection Issues:
- Make sure both backend and frontend are running
- Check that backend is on port 5000 and frontend can access it
- The Vite proxy is configured in `vite.config.js` to forward `/api` requests to `http://localhost:5000`

---

## Stopping the Application

- Press `Ctrl+C` in each terminal window to stop the servers
- Deactivate the Python virtual environment: `deactivate` (in the backend terminal)

