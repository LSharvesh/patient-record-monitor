"""
Mock data storage using Python dictionaries.
Simulates database interaction without a real database connection.
"""
from datetime import datetime, timedelta
import hashlib

# Mock Users Dictionary
USERS = {
    1: {
        'id': 1,
        'username': 'patient1',
        'password_hash': hashlib.sha256('password123'.encode()).hexdigest(),
        'role': 'patient',
        'name': 'John Doe',
        'membership_type': 'Premium'
    },
    2: {
        'id': 2,
        'username': 'patient2',
        'password_hash': hashlib.sha256('password123'.encode()).hexdigest(),
        'role': 'patient',
        'name': 'Jane Smith',
        'membership_type': 'Standard'
    },
    3: {
        'id': 3,
        'username': 'doctor1',
        'password_hash': hashlib.sha256('doctor123'.encode()).hexdigest(),
        'role': 'doctor',
        'name': 'Dr. Sarah Johnson',
        'membership_type': 'Premium'
    },
    4: {
        'id': 4,
        'username': 'patient3',
        'password_hash': hashlib.sha256('password123'.encode()).hexdigest(),
        'role': 'patient',
        'name': 'Bob Wilson',
        'membership_type': 'Free'
    }
}

# Mock Health Logs Dictionary
HEALTH_LOGS = {
    1: {
        'id': 1,
        'patient_id': 1,
        'timestamp': (datetime.now() - timedelta(days=6)).isoformat(),
        'cough_severity': 3,
        'breathing_issues': True,
        'chest_pain': False
    },
    2: {
        'id': 2,
        'patient_id': 1,
        'timestamp': (datetime.now() - timedelta(days=5)).isoformat(),
        'cough_severity': 2,
        'breathing_issues': False,
        'chest_pain': False
    },
    3: {
        'id': 3,
        'patient_id': 1,
        'timestamp': (datetime.now() - timedelta(days=4)).isoformat(),
        'cough_severity': 4,
        'breathing_issues': True,
        'chest_pain': True
    },
    4: {
        'id': 4,
        'patient_id': 1,
        'timestamp': (datetime.now() - timedelta(days=3)).isoformat(),
        'cough_severity': 3,
        'breathing_issues': True,
        'chest_pain': False
    },
    5: {
        'id': 5,
        'patient_id': 1,
        'timestamp': (datetime.now() - timedelta(days=2)).isoformat(),
        'cough_severity': 2,
        'breathing_issues': False,
        'chest_pain': False
    },
    6: {
        'id': 6,
        'patient_id': 1,
        'timestamp': (datetime.now() - timedelta(days=1)).isoformat(),
        'cough_severity': 1,
        'breathing_issues': False,
        'chest_pain': False
    },
    7: {
        'id': 7,
        'patient_id': 2,
        'timestamp': (datetime.now() - timedelta(days=2)).isoformat(),
        'cough_severity': 5,
        'breathing_issues': True,
        'chest_pain': True
    },
    8: {
        'id': 8,
        'patient_id': 2,
        'timestamp': (datetime.now() - timedelta(days=1)).isoformat(),
        'cough_severity': 4,
        'breathing_issues': True,
        'chest_pain': False
    },
    9: {
        'id': 9,
        'patient_id': 4,
        'timestamp': (datetime.now() - timedelta(days=3)).isoformat(),
        'cough_severity': 2,
        'breathing_issues': False,
        'chest_pain': False
    }
}

# Counter for generating new IDs
_next_user_id = max(USERS.keys()) + 1 if USERS else 1
_next_log_id = max(HEALTH_LOGS.keys()) + 1 if HEALTH_LOGS else 1


def get_user_by_credentials(username, password):
    """
    Authenticate user by username and password.
    Returns user dict if credentials match, None otherwise.
    """
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    for user in USERS.values():
        if user['username'] == username and user['password_hash'] == password_hash:
            # Return user without password_hash for security
            user_copy = user.copy()
            user_copy.pop('password_hash', None)
            return user_copy
    return None


def get_user_by_id(user_id):
    """
    Get user by ID.
    Returns user dict without password_hash, None if not found.
    """
    user = USERS.get(user_id)
    if user:
        user_copy = user.copy()
        user_copy.pop('password_hash', None)
        return user_copy
    return None


def get_all_patients():
    """
    Get all users with role 'patient'.
    Returns list of patient dicts without password_hash.
    """
    patients = []
    for user in USERS.values():
        if user['role'] == 'patient':
            user_copy = user.copy()
            user_copy.pop('password_hash', None)
            patients.append(user_copy)
    return patients


def get_patient_health_logs(patient_id, limit=None):
    """
    Get health logs for a specific patient.
    Returns list of health logs sorted by timestamp (newest first).
    """
    logs = [log for log in HEALTH_LOGS.values() if log['patient_id'] == patient_id]
    logs.sort(key=lambda x: x['timestamp'], reverse=True)
    
    if limit:
        logs = logs[:limit]
    
    return logs


def create_health_log(patient_id, cough_severity, breathing_issues, chest_pain):
    """
    Create a new health log entry.
    Returns the created log dict.
    """
    global _next_log_id
    
    new_log = {
        'id': _next_log_id,
        'patient_id': patient_id,
        'timestamp': datetime.now().isoformat(),
        'cough_severity': cough_severity,
        'breathing_issues': breathing_issues,
        'chest_pain': chest_pain
    }
    
    HEALTH_LOGS[_next_log_id] = new_log
    _next_log_id += 1
    
    return new_log

