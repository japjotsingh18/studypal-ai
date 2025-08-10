from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from pathlib import Path
import sqlite3
from datetime import datetime, timedelta
from functools import wraps
import secrets
from collections import defaultdict
import time

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)

# Security: Secure CORS configuration - only allow requests from specific origins
# This prevents other websites from making requests to your API
CORS(app, 
     origins=[
         "http://127.0.0.1:5500",  # Live Server (VS Code)
         "http://localhost:5500",   # Live Server (alternative)
         "http://127.0.0.1:5502",  # Live Server (VS Code - additional port)
         "http://localhost:5502",   # Live Server (alternative - additional port)
         "http://127.0.0.1:3000",  # Common dev server port
         "http://localhost:3000",   # Common dev server port
         "file://",                 # Local file access
         "https://japjotsingh18.github.io"  # GitHub Pages (if you redeploy)
     ],
     methods=["GET", "POST"],       # Only allow specific HTTP methods
     allow_headers=["Content-Type", "Authorization", "X-API-Key"],  # Include X-API-Key header
     supports_credentials=False     # Don't allow credentials for security
)

# Get the OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
print("DEBUG KEY:", OPENROUTER_API_KEY)  # For debug, should NOT be None

# Generate or get API key for authentication
API_SECRET_KEY = os.getenv("API_SECRET_KEY")
if not API_SECRET_KEY:
    # Generate a secure random key if not set in .env
    API_SECRET_KEY = secrets.token_urlsafe(32)
    print(f"⚠️  GENERATED API KEY: {API_SECRET_KEY}")
    print("⚠️  Add this to your .env file: API_SECRET_KEY=" + API_SECRET_KEY)
else:
    print("✅ API Secret Key loaded from .env")

# Rate limiting storage
rate_limit_storage = defaultdict(list)

# Rate limiting decorator
def rate_limit(max_requests=10, per_seconds=60, endpoint_name="default"):
    """
    Rate limiting decorator to prevent API abuse.
    
    Args:
        max_requests: Maximum number of requests allowed
        per_seconds: Time window in seconds
        endpoint_name: Name of the endpoint for separate rate limiting
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client identifier (IP address + API key for better tracking)
            client_ip = request.remote_addr
            api_key = request.headers.get('X-API-Key', 'anonymous')
            client_id = f"{client_ip}:{api_key}:{endpoint_name}"
            
            current_time = time.time()
            
            # Clean old requests outside the time window
            rate_limit_storage[client_id] = [
                req_time for req_time in rate_limit_storage[client_id] 
                if current_time - req_time < per_seconds
            ]
            
            # Check if rate limit exceeded
            if len(rate_limit_storage[client_id]) >= max_requests:
                return jsonify({
                    "error": f"Rate limit exceeded. Maximum {max_requests} requests per {per_seconds} seconds.",
                    "retry_after": per_seconds
                }), 429
            
            # Add current request timestamp
            rate_limit_storage[client_id].append(current_time)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Authentication decorator - Modified for session-based auth
def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # For local development, we'll use a simple session approach
        # Check if request is from allowed origins (already handled by CORS)
        
        # Optional: Check for a simple session token or just allow local requests
        origin = request.headers.get('Origin', '')
        referer = request.headers.get('Referer', '')
        
        # Allow requests from localhost/127.0.0.1 (local development)
        if ('127.0.0.1' in referer or 'localhost' in referer or 
            '127.0.0.1' in origin or 'localhost' in origin):
            return f(*args, **kwargs)
        
        # For production, you would implement proper authentication here
        # For now, require API key only for non-local requests
        api_key = request.headers.get('X-API-Key')
        
        if not api_key:
            return jsonify({"error": "Missing API key. Include X-API-Key header."}), 401
        
        if api_key != API_SECRET_KEY:
            return jsonify({"error": "Invalid API key"}), 403
            
        return f(*args, **kwargs)
    return decorated_function

@app.route("/api/chat", methods=["POST"])
@rate_limit(max_requests=2, per_seconds=60, endpoint_name="chat")  # 2 chat requests per minute
@require_api_key
def chat():
    data = request.get_json()
    user_message = data.get("message")

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-3.5-turbo",  # You can change to claude, mistral, etc.
                "messages": [
                    {"role": "system", "content": "You are a helpful study assistant named StudyPal AI."},
                    {"role": "user", "content": user_message}
                ]
            }
        )

        data = response.json()
        print("DEBUG Response JSON:", data)

        if "choices" not in data:
            return jsonify({"error": f"OpenRouter response missing 'choices': {data}"}), 500

        reply = data["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": reply})

    except Exception as e:
        print("Exception:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/save-session", methods=["POST"])
@rate_limit(max_requests=2, per_seconds=60, endpoint_name="save-session")  # 2 saves per minute
@require_api_key
def save_session():
    data = request.get_json()
    total_time = data.get("totalTime")
    session_count = data.get("sessionCount")

    if total_time is None or session_count is None:
        return jsonify({"error": "Missing totalTime or sessionCount"}), 400

    db_path = os.path.join(os.path.dirname(__file__), "studypal_data.db")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        # Create table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                total_time INTEGER NOT NULL,
                session_count INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # Insert session data
        cursor.execute(
            "INSERT INTO sessions (total_time, session_count) VALUES (?, ?)",
            (total_time, session_count)
        )
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Session saved successfully."})
    except Exception as e:
        print("Exception:", e)
        return jsonify({"error": str(e)}), 500


# Fetch last 10 study sessions
@app.route("/api/get-sessions", methods=["GET"])
@rate_limit(max_requests=2, per_seconds=60, endpoint_name="get-sessions")  # 2 reads per minute
def get_sessions():
    db_path = os.path.join(os.path.dirname(__file__), "studypal_data.db")
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, total_time, session_count, timestamp
            FROM sessions
            ORDER BY timestamp DESC
            LIMIT 10
        """)
        rows = cursor.fetchall()
        sessions = [dict(row) for row in rows]
        conn.close()
        return jsonify({"sessions": sessions})
    except Exception as e:
        print("Exception:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/rate-limit-status", methods=["GET"])
def rate_limit_status():
    """Check current rate limit status for debugging."""
    client_ip = request.remote_addr
    api_key = request.headers.get('X-API-Key', 'anonymous')
    current_time = time.time()
    
    status = {}
    for endpoint in ["chat", "save-session", "get-sessions"]:
        client_id = f"{client_ip}:{api_key}:{endpoint}"
        # Clean old requests
        rate_limit_storage[client_id] = [
            req_time for req_time in rate_limit_storage[client_id] 
            if current_time - req_time < 60
        ]
        status[endpoint] = {
            "requests_made": len(rate_limit_storage[client_id]),
            "requests_remaining": {
                "chat": 2 - len(rate_limit_storage[f"{client_ip}:{api_key}:chat"]),
                "save-session": 2 - len(rate_limit_storage[f"{client_ip}:{api_key}:save-session"]),
                "get-sessions": 2 - len(rate_limit_storage[f"{client_ip}:{api_key}:get-sessions"])
            }[endpoint]
        }
    
    return jsonify({
        "rate_limits": {
            "chat": "2 requests per minute",
            "save-session": "2 requests per minute", 
            "get-sessions": "2 requests per minute"
        },
        "current_status": status,
        "client_ip": client_ip
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True) 