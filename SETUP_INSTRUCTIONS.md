# 🚀 Quick Setup Instructions

## Step-by-Step Guide to Run SkillSphere

### ⚡ Quick Start (5 minutes)

#### 1. Setup MongoDB Atlas (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a FREE cluster (M0)
4. Create a database user:
   - Username: `skillsphere_admin`
   - Password: `skillsphere123` (or your choice)
5. Network Access → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

#### 2. Configure Backend (1 minute)

Open `backend/.env` and update:

```env
MONGODB_URI=mongodb+srv://skillsphere_admin:skillsphere123@cluster0.xxxxx.mongodb.net/skillsphere?retryWrites=true&w=majority
JWT_SECRET=skillsphere_hackathon_jwt_secret_key_2026
PORT=5000
NODE_ENV=development
```

Replace the connection string with yours from MongoDB Atlas.

#### 3. Start Backend (1 minute)

```bash
# Open Terminal 1
cd backend
npm install
npm run dev
```

✅ You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000
```

#### 4. Start Frontend (1 minute)

```bash
# Open Terminal 2 (new terminal)
cd skillsphere
npm install
npm start
```

✅ Browser will open automatically at http://localhost:3000

---

## 🎯 Test the Application

### Create Your First User

1. **Register** (http://localhost:3000/register)
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Select a domain (Healthcare/Agriculture/Urban)
   - Click "Create Account"

2. **Login** (http://localhost:3000/login)
   - Email: `test@example.com`
   - Password: `password123`
   - Click "Sign In"

3. **Dashboard**
   - You'll see a welcome message with your name
   - Your role and domain will be displayed

---

## 🔧 Commands Reference

### Backend Commands
```bash
cd backend

# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

### Frontend Commands
```bash
cd skillsphere

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/

---

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:**
1. Check your connection string in `backend/.env`
2. Ensure password doesn't contain special characters (or URL encode them)
3. Verify IP whitelist in MongoDB Atlas (use 0.0.0.0/0 for testing)

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "Cannot connect to backend"
**Solution:**
1. Ensure backend is running (Terminal 1)
2. Check backend URL in `skillsphere/src/services/api.js` (should be http://localhost:5000/api)
3. Clear browser cache and localStorage

### Issue: "CORS error"
**Solution:**
- Backend already has CORS enabled
- If still facing issues, restart both servers

---

## 🎨 What You'll See

### Login Page
- Beautiful gradient background (purple)
- Clean, modern form
- Email and password fields
- Link to registration

### Registration Page
- Full name, email, password fields
- Domain selection with icons:
  - 🏥 Healthcare
  - 🌾 Agriculture
  - 🏙️ Smart Cities
- Visual feedback on selection

### Dashboard
- Welcome message with user name
- Role and domain display
- Logout button
- Placeholder for upcoming features

---

## 📊 Verify Data in MongoDB Atlas

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. You should see:
   - `users` collection (your registered user)
   - `studentprofiles` collection (auto-created profile)
   - `activitylogs` collection (login/register activities)

---

## 🎯 Next Features to Implement

After basic auth is working, you can add:

1. **Profile Management**
   - Edit profile page
   - Add skills with proficiency levels
   - Add projects

2. **Skill Analysis**
   - Define skill frameworks (admin)
   - Calculate readiness score
   - Show skill gaps

3. **Recommendations**
   - Course suggestions
   - Project ideas
   - Learning paths

4. **Visualizations**
   - Skill radar charts
   - Progress bars
   - Career roadmap

---

## 💡 Pro Tips

1. **Use MongoDB Compass** (free GUI) to view your database locally
2. **Use Postman** to test API endpoints directly
3. **Check browser console** for frontend errors
4. **Check terminal** for backend errors
5. **Use React DevTools** for debugging React components

---

## 🆘 Need Help?

1. Check `backend/MONGODB_SETUP.md` for detailed MongoDB setup
2. Check `README.md` for full documentation
3. Look at API endpoints in `backend/routes/auth.js`
4. Check frontend code in `skillsphere/src/pages/`

---

**You're all set! Start coding! 🚀**
