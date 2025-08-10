# StudyPal AI Security Implementation

## 🔒 **Origin-Based Authentication** (Updated Architecture)

StudyPal AI implements **secure origin-based authentication** that completely eliminates client-side API keys while maintaining full security for backend endpoints.

### How It Works for GitHub Users

1. **🚫 Zero Client-Side API Keys**: No API keys exposed in frontend code whatsoever
2. **🌐 Origin Validation**: Backend validates requests from trusted origins (localhost/127.0.0.1)
3. **🔒 Server-Side Security**: All sensitive keys stored securely in backend `.env` files only
4. **✅ GitGuardian Verified**: Repository scanned and confirmed with "0 secrets detected"

### 🔑 Secure Architecture for GitHub Distribution

✅ **What's Safe in the Repository:**
- ✅ Complete source code with secure authentication
- ✅ Setup instructions and comprehensive documentation
- ✅ Frontend code with **zero API keys or secrets**
- ✅ Backend code with placeholder environment variables

❌ **What's Protected (Never in Repository):**
- ❌ **NO API keys** (secured in gitignored `.env` files)
- ❌ **NO access to original backend** (each user runs their own)
- ❌ **NO client-side secrets** (authentication handled server-side)

### Origin-Based Authentication Flow

**For Local Development:**
1. **Frontend Request**: Browser makes request from `http://localhost` or `http://127.0.0.1`
2. **Origin Validation**: Backend checks request origin/referer headers
3. **Automatic Authentication**: Trusted origins bypass API key requirements
4. **Secure Processing**: Backend handles OpenRouter API calls internally

**For Production Deployment:**
- Backend can be configured with API key authentication for non-localhost origins
- Environment variables control authentication behavior
- CORS settings restrict allowed origins

### User Setup Process (Simplified)

**For GitHub users who clone this repository:**

1. **🔓 Your API costs are completely protected** - no keys exposed anywhere in frontend
2. **🏠 Users run their own backend locally** - complete isolation from original instance
3. **⚡ Frontend works independently** - study timer and games work offline
4. **🎓 Educational value** - demonstrates proper security architecture

**Simple setup for new users:**
```bash
# 1. Clone the repository
git clone https://github.com/japjotsingh18/studypal-ai.git
cd studypal-ai

# 2. Get your own API key from https://openrouter.ai/

# 3. Create backend/.env file:
OPENROUTER_API_KEY=your_own_api_key_here
API_SECRET_KEY=any_random_string_here

# 4. Install and run backend
cd backend
pip install flask flask-cors openai python-dotenv requests
python app.py

# 5. Open frontend/docs/index.html in browser
# ✅ Everything works automatically with origin-based auth
```

### Security Features Implemented

✅ **Origin-Based Authentication**
- Backend validates request origin/referer headers
- Trusted localhost origins (127.0.0.1, localhost) automatically authenticated
- No API keys required in frontend for local development
- Fallback API key auth available for production deployments

✅ **Zero Client-Side Secrets**
- **No API keys in JavaScript files** - GitGuardian verified
- **No authentication headers in frontend** - completely removed
- **No environment variables in build** - all secrets server-side only
- **No hardcoded credentials** - placeholders only in repository

✅ **Rate Limiting**
- **Chat endpoint**: 2 requests per minute (prevents AI API abuse)
- **Save session**: 2 requests per minute (prevents database spam)
- **Get sessions**: 2 requests per minute (allows limited reads)
- Returns HTTP 429 when limits exceeded
- Per-client tracking with IP-based identification

✅ **CORS Protection**
- Restricted to localhost origins for development
- Limited HTTP methods (GET, POST only)
- Controlled headers (Content-Type only, no API key headers)
- Prevents unauthorized cross-origin requests

✅ **Input Validation**
- JSON payload validation
- Required field checking
- Error handling for malformed requests
- Sanitized database operations

### Testing Security

Test the secure origin-based authentication:

```bash
# ✅ Should succeed from localhost (origin-based auth)
curl -X POST http://127.0.0.1:5001/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"message": "test"}'

# ❌ Should fail from unauthorized origin  
curl -X POST http://127.0.0.1:5001/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://malicious-site.com" \
  -d '{"message": "test"}'

# ✅ Check server status and security
curl http://127.0.0.1:5001/api/rate-limit-status

# Test rate limiting (3rd request should fail with 429)
for i in {1..3}; do 
  curl -X POST http://127.0.0.1:5001/api/chat \
    -H "Content-Type: application/json" \
    -H "Origin: http://localhost:3000" \
    -d '{"message": "test"}' 
done
```

### GitGuardian Security Verification

**Repository Security Status:**
- ✅ **Latest scan**: 0 secrets detected in current commits
- ✅ **Historical analysis**: All previous API keys marked as "Invalid" or "Ignored"  
- ✅ **Continuous monitoring**: Automated security scans via GitHub integration
- ✅ **Best practices**: All sensitive data in gitignored `.env` files

**Scan Command:**
```bash
# Install and run GitGuardian locally
pip install detect-secrets
ggshield secret scan repo --all-secrets
```

### Production Recommendations

**Current Security Level: Production-Ready ✅**

1. **✅ Origin Validation**: Already implemented for trusted localhost origins
2. **✅ HTTPS Ready**: Code supports HTTPS deployment without changes
3. **✅ Rate Limiting**: Professional-grade 2 req/min limits implemented
4. **✅ Environment Isolation**: All secrets properly externalized
5. **✅ CORS Security**: Restrictive cross-origin policies in place
6. **✅ Input Validation**: Comprehensive request sanitization

**Optional Enhancements for Scale:**
- **API Versioning**: Add `/v1/` prefixes for future compatibility
- **Request Logging**: Enhanced audit trail for production monitoring  
- **Authentication Tokens**: JWT-based auth for multi-user deployments
- **Database Security**: Connection pooling and query optimization

### Deployment Security Checklist

**✅ Current Implementation Status:**
- [x] No secrets in repository (GitGuardian verified)
- [x] Environment variables for all sensitive data
- [x] Origin-based authentication for development
- [x] Rate limiting to prevent API abuse
- [x] CORS protection against unauthorized access
- [x] Input validation and sanitization
- [x] Error handling without information disclosure
- [x] Secure database operations (SQLite with parameterized queries)

## 🚀 Quick Setup for New Users

**Simplified Secure Setup Process:**

```bash
# 1. Clone the repository (completely secure - no secrets exposed)
git clone https://github.com/japjotsingh18/studypal-ai.git
cd studypal-ai

# 2. Get your OpenRouter API key from https://openrouter.ai/

# 3. Create backend/.env file with your credentials:
echo "OPENROUTER_API_KEY=your_api_key_here" > backend/.env
echo "API_SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')" >> backend/.env

# 4. Install dependencies and start backend
cd backend
python -m venv ../backend-env
source ../backend-env/bin/activate  # Windows: ../backend-env/Scripts/activate
pip install flask flask-cors openai python-dotenv requests
python app.py

# 5. Open frontend/docs/index.html in your browser
# ✅ Origin-based authentication works automatically
# ✅ No frontend configuration needed
# ✅ Completely secure setup
```

**What Makes This Secure:**
- **🔒 No secrets in repository**: GitGuardian verified with 0 detections
- **🏠 Isolated environments**: Each user has their own backend instance  
- **⚡ Zero configuration**: Frontend automatically authenticates via origin
- **💰 Cost protection**: No way for users to access original API credits

This architecture ensures maximum security while providing the simplest possible setup experience for new users.
