from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from pathlib import Path
import sqlite3
from datetime import datetime

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
CORS(app)  # Enable CORS so frontend can talk to backend

# Get the OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
print("DEBUG KEY:", OPENROUTER_API_KEY)  # For debug, should NOT be None

@app.route("/api/chat", methods=["POST"])
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

if __name__ == "__main__":
    app.run(port=5001, debug=True)
