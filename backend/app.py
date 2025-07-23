from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from pathlib import Path
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

if __name__ == "__main__":
    app.run(debug=True)
