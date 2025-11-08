"""
Flask REST API for Breathe Right AI
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from jose import jwt
from datetime import datetime, timedelta
import models

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Secret key for JWT (in production, use environment variable)
SECRET_KEY = "breathe-right-ai-secret-key-2024"
ALGORITHM = "HS256"


def generate_token(user_id, role):
    """Generate JWT token for authenticated user"""
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token):
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except Exception:
        return None


def require_auth(f):
    """Decorator to require authentication"""
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'message': 'No authorization header'}), 401
        
        try:
            token = auth_header.split(' ')[1]  # Bearer <token>
        except IndexError:
            return jsonify({'success': False, 'message': 'Invalid token format'}), 401
        
        payload = verify_token(token)
        if not payload:
            return jsonify({'success': False, 'message': 'Invalid or expired token'}), 401
        
        request.user_id = payload['user_id']
        request.user_role = payload['role']
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function


def require_role(role):
    """Decorator to require specific role"""
    def decorator(f):
        def decorated_function(*args, **kwargs):
            if request.user_role != role:
                return jsonify({'success': False, 'message': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        decorated_function.__name__ = f.__name__
        return decorated_function
    return decorator


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password required'}), 400
    
    user = models.get_user_by_credentials(username, password)
    
    if not user:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
    token = generate_token(user['id'], user['role'])
    
    return jsonify({
        'success': True,
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'name': user['name'],
            'role': user['role'],
            'membership_type': user['membership_type']
        }
    }), 200


@app.route('/api/health/logs', methods=['POST'])
@require_auth
def create_health_log():
    """Create a new health log entry (patient only)"""
    if request.user_role != 'patient':
        return jsonify({'success': False, 'message': 'Only patients can create health logs'}), 403
    
    data = request.get_json()
    cough_severity = data.get('cough_severity')
    breathing_issues = data.get('breathing_issues')
    chest_pain = data.get('chest_pain')
    
    # Validation
    if cough_severity is None or not isinstance(cough_severity, int) or cough_severity < 1 or cough_severity > 5:
        return jsonify({'success': False, 'message': 'cough_severity must be an integer between 1 and 5'}), 400
    
    if breathing_issues is None or not isinstance(breathing_issues, bool):
        return jsonify({'success': False, 'message': 'breathing_issues must be a boolean'}), 400
    
    if chest_pain is None or not isinstance(chest_pain, bool):
        return jsonify({'success': False, 'message': 'chest_pain must be a boolean'}), 400
    
    new_log = models.create_health_log(
        patient_id=request.user_id,
        cough_severity=cough_severity,
        breathing_issues=breathing_issues,
        chest_pain=chest_pain
    )
    
    return jsonify({
        'success': True,
        'data': new_log,
        'message': 'Health log created successfully'
    }), 201


@app.route('/api/health/logs/<int:patient_id>', methods=['GET'])
@require_auth
def get_health_logs(patient_id):
    """Get health logs for a specific patient"""
    # Patients can only view their own logs, doctors can view any patient's logs
    if request.user_role == 'patient' and request.user_id != patient_id:
        return jsonify({'success': False, 'message': 'You can only view your own health logs'}), 403
    
    logs = models.get_patient_health_logs(patient_id)
    
    return jsonify({
        'success': True,
        'data': logs
    }), 200


@app.route('/api/patients', methods=['GET'])
@require_auth
@require_role('doctor')
def get_patients():
    """Get list of all patients (doctor only)"""
    patients = models.get_all_patients()
    
    return jsonify({
        'success': True,
        'data': patients
    }), 200


@app.route('/api/emergency/alert', methods=['POST'])
@require_auth
def emergency_alert():
    """Emergency alert endpoint"""
    if request.user_role != 'patient':
        return jsonify({'success': False, 'message': 'Only patients can send emergency alerts'}), 403
    
    # In a real application, this would trigger notifications, alerts, etc.
    return jsonify({
        'success': True,
        'message': 'Emergency alert sent successfully. Medical personnel have been notified.'
    }), 200


@app.route('/api/reports/generate', methods=['POST'])
@require_auth
def generate_report():
    """Generate health report (patient only)"""
    if request.user_role != 'patient':
        return jsonify({'success': False, 'message': 'Only patients can generate reports'}), 403
    
    # In a real application, this would generate a PDF or detailed report
    return jsonify({
        'success': True,
        'message': 'Report generated successfully',
        'data': {
            'report_id': f'report_{request.user_id}_{datetime.now().timestamp()}',
            'generated_at': datetime.now().isoformat()
        }
    }), 200


@app.route('/api/chatbot/query', methods=['POST'])
@require_auth
def chatbot_query():
    """AI Chatbot endpoint - returns echo with greeting"""
    data = request.get_json()
    user_input = data.get('message', '')
    
    # Stub implementation - echo user input with greeting
    if not user_input:
        response = "Hello! I'm Breathe Right AI assistant. How can I help you with your lung health today?"
    else:
        response = f"You said: {user_input}. This is a stub response. In the full implementation, I would provide helpful lung health advice."
    
    return jsonify({
        'success': True,
        'data': {
            'response': response
        }
    }), 200


@app.route('/', methods=['GET'])
def root():
    """Root endpoint - API information"""
    return jsonify({
        'success': True,
        'message': 'Breathe Right AI API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'login': '/api/auth/login (POST)',
            'health_logs': '/api/health/logs (POST)',
            'patient_logs': '/api/health/logs/<patient_id> (GET)',
            'patients': '/api/patients (GET) - Doctor only',
            'emergency': '/api/emergency/alert (POST)',
            'reports': '/api/reports/generate (POST)',
            'chatbot': '/api/chatbot/query (POST)'
        }
    }), 200


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Breathe Right AI API is running'
    }), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)

