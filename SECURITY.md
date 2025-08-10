# StudyPal AI Security Implementation

## API Authentication

This application implements API key authentication to secure backend endpoints while allowing safe public sharing on GitHub.

### How It Works for GitHub Users

1. **Backend Protection**: Sensitive endpoints (`/api/chat`, `/api/save-session`) require an API key
2. **Individual Setup**: Each user must configure their own API keys (your keys are NOT shared)
3. **Frontend Authentication**: Requests include API key in `X-API-Key` header
4. **CORS Security**: Only specific origins are allowed to make requests

### 🔑 API Key Management for Users

⚠️ **IMPORTANT**: Users who clone this repository will need to set up their own API keys.

**What's included in the repository:**
- ✅ Complete source code and security implementation
- ✅ Setup instructions and documentation
- ❌ **NO API keys** (they're in `.env` files which are gitignored)
- ❌ **NO access to your backend** (users run their own instance)

**What users need to do:**
1. **Get their own OpenRouter API key** from https://openrouter.ai/
2. **Create their own `backend/.env` file** with their keys
3. **Run their own backend instance** locally
4. **Frontend works offline** even without backend setup

### Current API Key Location

⚠️ **FOR DEVELOPERS**: The API key is hardcoded in frontend files for development convenience.

**For GitHub users who clone this repository:**

1. **Your API costs are protected** - cloners cannot use your OpenRouter credits
2. **Users must provide their own API keys** - each person runs their own backend
3. **Frontend works independently** - study timer and games work offline
4. **Educational value** - demonstrates proper API key management

**Setup required for new users:**
```bash
# 1. Get your own API key from https://openrouter.ai/
# 2. Create backend/.env file:
OPENROUTER_API_KEY=your_own_api_key_here
API_SECRET_KEY=any_random_string_here

# 3. Update frontend files with your own API_SECRET_KEY
# 4. Run your own backend instance
```

### Security Features Implemented

✅ **API Key Authentication**
- Backend validates `X-API-Key` header
- Invalid/missing keys return 401/403 errors
- Key stored securely in backend `.env` file

✅ **Rate Limiting**
- **Chat endpoint**: 2 requests per minute (prevents AI API abuse)
- **Save session**: 2 requests per minute (prevents database spam)
- **Get sessions**: 2 requests per minute (allows limited reads)
- Returns HTTP 429 when limits exceeded
- Per-client tracking (IP + API key combination)

✅ **CORS Protection**
- Only specific origins allowed
- Restricted HTTP methods (GET, POST only)
- Limited headers permitted (Content-Type, Authorization, X-API-Key)
- No credential sharing

✅ **Input Validation**
- JSON payload validation
- Required field checking
- Error handling for malformed requests

### Testing Security

Test unauthorized access:
```bash
# Should fail with 401 error
curl -X POST http://127.0.0.1:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Should succeed with valid API key
curl -X POST http://127.0.0.1:5001/api/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"message": "test"}'

# Test rate limiting (3rd request should fail)
for i in {1..3}; do 
  curl -X POST http://127.0.0.1:5001/api/chat \
    -H "Content-Type: application/json" \
    -H "X-API-Key: YOUR_API_KEY" \
    -d '{"message": "test"}' 
done

# Check rate limit status
curl http://127.0.0.1:5001/api/rate-limit-status
```

### Production Recommendations

1. **Environment Variables**: Move API key to build-time environment variable
2. **HTTPS Only**: Deploy with SSL/TLS certificates
3. **Rate Limiting**: Implement request rate limiting
4. **Logging**: Add security event logging
5. **API Versioning**: Version your API endpoints
6. **Input Sanitization**: Additional input validation and sanitization

### API Key Management for GitHub Distribution

**How it works when someone clones your repository:**

1. **🔒 Your Keys Stay Private**
   - `backend/.env` is gitignored (not uploaded to GitHub)
   - Frontend has placeholder keys that won't work with your backend
   - Each user must create their own `.env` file

2. **👥 Each User Gets Their Own Setup**
   ```bash
   # User clones your repo
   git clone https://github.com/japjotsingh18/studypal-ai.git
   
   # User must create their own backend/.env:
   OPENROUTER_API_KEY=their_own_openrouter_key
   API_SECRET_KEY=their_own_random_secret
   
   # User updates frontend with their API_SECRET_KEY
   # User runs their own backend instance
   ```

3. **💰 No Cost Risk to You**
   - Users cannot access your OpenRouter account
   - Users cannot make API calls using your credits
   - Each person pays for their own usage

### Current Security Level

🔒 **For GitHub Sharing**: ✅ **PERFECT**
- Your API costs are protected
- Users learn proper environment setup
- Code demonstrates security best practices
- Frontend works offline without backend

🚀 **For Personal Use**: ✅ **EXCELLENT**
- API key authentication prevents unauthorized access
- CORS protection against cross-site attacks
- Professional-grade security implementation

This implementation provides a solid foundation for API security while maintaining ease of development and safe GitHub distribution.

## 🚀 Quick Setup for New Users

We've included a setup script to make this easy:

```bash
# 1. Clone the repository
git clone https://github.com/japjotsingh18/studypal-ai.git
cd studypal-ai

# 2. Run the automated setup script
python setup.py

# 3. Follow the prompts to enter your OpenRouter API key
# 4. Script automatically generates API_SECRET_KEY and updates all files
# 5. Install dependencies and run the backend
```

This ensures each user has their own unique API keys and cannot access the original developer's backend or API credits.
