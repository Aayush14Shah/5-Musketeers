# 🚀 SkillSphere - Quick Reference Card

## ⚡ 30-Second Start

```bash
# Terminal 1 - Backend
cd backend
npm install
# Edit .env with MongoDB connection string
npm run dev

# Terminal 2 - Frontend
cd skillsphere
npm install
npm start
```

**Open:** http://localhost:3000

---

## 📋 Essential Commands

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev             # Start dev server (auto-reload)
npm start               # Start production server
```

### Frontend
```bash
cd skillsphere
npm install              # Install dependencies
npm start               # Start dev server
npm run build           # Build for production
```

---

## 🔗 URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React app |
| Backend | http://localhost:5000 | API server |
| Login | http://localhost:3000/login | Login page |
| Register | http://localhost:3000/register | Sign up |
| Dashboard | http://localhost:3000/dashboard | User home |

---

## 🔐 API Endpoints

### Public
```
POST /api/auth/register  - Create account
POST /api/auth/login     - Sign in
```

### Protected (requires token)
```
GET  /api/auth/me        - Get current user
```

---

## 📊 Test Data

### Test User
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "domainInterest": "healthcare"
}
```

### Admin User (create via Postman)
```json
{
  "name": "Admin User",
  "email": "admin@skillsphere.com",
  "password": "admin123",
  "role": "admin",
  "domainInterest": "healthcare"
}
```

---

## 🗄️ Database Collections

```
skillsphere (database)
├── users              - User accounts
├── studentprofiles    - Student data
└── activitylogs       - Audit trail
```

---

## 🔧 Environment Variables

### backend/.env
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsphere?retryWrites=true&w=majority
JWT_SECRET=skillsphere_hackathon_jwt_secret_key_2026
PORT=5000
NODE_ENV=development
```

---

## 📁 Key Files

### Backend
```
backend/
├── server.js              - Entry point
├── config/db.js           - MongoDB connection
├── models/User.js         - User schema
├── routes/auth.js         - Auth endpoints
└── middleware/auth.js     - JWT verification
```

### Frontend
```
skillsphere/src/
├── App.js                 - Main app + routing
├── pages/Login.js         - Login page
├── pages/Register.js      - Registration
├── pages/Dashboard.js     - User dashboard
├── context/AuthContext.js - Auth state
└── services/api.js        - API client
```

---

## 🐛 Quick Fixes

### Backend won't start
```bash
# Check MongoDB connection
# Update .env with correct URI
# Verify IP whitelist in MongoDB Atlas
```

### Port in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Can't login
```javascript
// Clear browser storage
localStorage.clear()
// Refresh page
```

---

## 🎨 Domain Options

- 🏥 **healthcare** - Healthcare Technology
- 🌾 **agriculture** - Agricultural Technology
- 🏙️ **urban** - Smart City Systems

---

## 🔒 User Roles

- **student** (default) - Regular users
- **admin** - System administrators

---

## 📦 Tech Stack

**Backend:** Node.js, Express, MongoDB, JWT, bcryptjs  
**Frontend:** React, React Router, Axios, Context API  
**Database:** MongoDB Atlas (cloud)

---

## 🎯 Features Status

✅ User Registration  
✅ User Login  
✅ JWT Authentication  
✅ Protected Routes  
✅ Role-based Access  
✅ Beautiful UI  
✅ Responsive Design  
✅ Activity Logging  

🔜 Profile Management  
🔜 Skill Gap Analysis  
🔜 Recommendations  
🔜 Admin Dashboard  
🔜 Visualizations  

---

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP_INSTRUCTIONS.md** - Setup guide
- **COMMANDS_TO_RUN.md** - All commands
- **ARCHITECTURE.md** - System design
- **PROJECT_SUMMARY.md** - Complete overview
- **backend/MONGODB_SETUP.md** - MongoDB guide

---

## 🆘 Help

### MongoDB Issues
→ Read `backend/MONGODB_SETUP.md`

### API Issues
→ Read `backend/README.md`

### General Setup
→ Read `SETUP_INSTRUCTIONS.md`

---

## 💡 Pro Tips

1. Keep both terminals running
2. Check terminal for errors
3. Use browser console (F12)
4. MongoDB Atlas GUI to view data
5. Postman for API testing

---

## 🎯 Quick Test Flow

1. **Start servers** (backend + frontend)
2. **Register** at /register
3. **Login** at /login
4. **View Dashboard** - see your info
5. **Check MongoDB** - verify data saved

---

## 🏆 Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected (see ✅ in terminal)
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard shows user info
- [ ] Data visible in MongoDB Atlas

---

**All systems ready! Start building! 🚀**
