#!/usr/bin/env python3
"""
StudyPal AI Setup Script
Helps users generate API keys and set up their environment.
"""

import secrets
import os
from pathlib import Path

def generate_api_secret():
    """Generate a secure random API secret key."""
    return secrets.token_urlsafe(32)

def setup_env_file():
    """Create .env file with user input."""
    backend_dir = Path(__file__).parent / "backend"
    env_file = backend_dir / ".env"
    
    print("🔑 StudyPal AI Setup")
    print("=" * 50)
    
    # Get OpenRouter API key
    print("\n1. Get your OpenRouter API key from: https://openrouter.ai/")
    openrouter_key = input("   Enter your OpenRouter API key: ").strip()
    
    if not openrouter_key.startswith("sk-or-v1-"):
        print("⚠️  Warning: API key should start with 'sk-or-v1-'")
    
    # Generate API secret
    api_secret = generate_api_secret()
    print(f"\n2. Generated API secret key: {api_secret}")
    
    # Create .env file
    env_content = f"""# StudyPal AI Environment Variables
OPENROUTER_API_KEY={openrouter_key}
API_SECRET_KEY={api_secret}
"""
    
    try:
        env_file.write_text(env_content)
        print(f"\n✅ Created {env_file}")
    except Exception as e:
        print(f"\n❌ Error creating .env file: {e}")
        return None, None
    
    return openrouter_key, api_secret

def update_frontend_files(api_secret):
    """Update frontend files - SECURE VERSION (no client-side API keys)"""
    print("🔒 Securing frontend files (removing client-side API keys)...")
    
    frontend_dir = Path(__file__).parent / "frontend" / "docs"
    
    # Update script.js - Remove API key for security
    script_file = frontend_dir / "script.js"
    if script_file.exists():
        content = script_file.read_text()
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.strip().startswith('const API_KEY ='):
                lines[i] = "// API_KEY removed for security - backend handles authentication"
                break
        
        script_file.write_text('\n'.join(lines))
        print(f"✅ Secured {script_file} - API key removed from client-side")
    
    # Update index.html - Remove API key headers for security
    html_file = frontend_dir / "index.html"
    if html_file.exists():
        content = html_file.read_text()
        
        # Remove any remaining X-API-Key headers
        content = content.replace(
            "'X-API-Key': 'PLACEHOLDER_API_KEY_REPLACE_WITH_SETUP_SCRIPT'",
            "// 'X-API-Key' removed for security"
        )
        content = content.replace(
            '"X-API-Key": "PLACEHOLDER_API_KEY_REPLACE_WITH_SETUP_SCRIPT"',
            '// "X-API-Key" removed for security'
        )
        
        html_file.write_text(content)
        print(f"✅ Secured {html_file} - API key headers removed")
    
    print("🛡️  Frontend is now secure - no API keys exposed in client-side code!")

def main():
    print("Welcome to StudyPal AI Setup! 🎓")
    print("This script will help you configure your API keys.\n")
    
    # Setup backend .env file
    openrouter_key, api_secret = setup_env_file()
    
    if not api_secret:
        print("❌ Setup failed. Please try again.")
        return
    
    # Update frontend files
    print("\n3. Updating frontend files...")
    update_frontend_files(api_secret)
    
    print("\n🎉 Setup complete!")
    print("\nNext steps:")
    print("1. cd backend")
    print("2. source ../backend-env/bin/activate")
    print("3. pip install flask flask-cors openai python-dotenv requests")
    print("4. python app.py")
    print("5. Open frontend/docs/index.html in your browser")
    print("\nEnjoy studying with StudyPal AI! 📚")

if __name__ == "__main__":
    main()
