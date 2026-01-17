# 🎯 Commands to Run - SkillSphere

## ✅ What's Already Done

All code is written and ready! You just need to:
1. Setup MongoDB Atlas
2. Update the connection string
3. Run the servers

---

## 📋 Step-by-Step Commands

### 1️⃣ Setup MongoDB Atlas (One-time setup)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free account)
3. Create a FREE cluster (M0 Sandbox)
4. Create database user:
   - Username: `skillsphere_admin`
   - Password: `skillsphere123`
5. Network Access → Add IP → **Allow Access from Anywhere** (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the string (looks like: `mongodb+srv://...`)

### 2️⃣ Update Backend Configuration

Open `backend/.env` file and replace the MongoDB URI:

```env
MONGODB_URI=mongodb+srv://skillsphere_admin:skillsphere123@cluster0.xxxxx.mongodb.net/skillsphere?retryWrites=true&w=majority
```

(Replace with your actual connection string from MongoDB Atlas)

### 3️⃣ Run Backend Server

Open **Terminal 1**:

```bash
cd backend
npm install
npm run dev
```

✅ **Expected Output:**
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000
📝 Environment: development
```

### 4️⃣ Run Frontend Server

Open **Terminal 2** (new terminal):

```bash
cd skillsphere
npm install
npm start
```

✅ **Expected Output:**
```
Compiled successfully!

You can now view skillsphere in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Browser will open automatically at http://localhost:3000

---

## 🎉 Test the Application

### Test Registration

1. Go to: http://localhost:3000/register
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Domain: Click on any (Healthcare/Agriculture/Smart Cities)
3. Click **"Create Account"**
4. ✅ You should be redirected to Dashboard

### Test Login

1. Go to: http://localhost:3000/login
2. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Sign In"**
4. ✅ You should see Dashboard with welcome message

---

## 🔍 Verify Everything Works

### Check Backend
- Open: http://localhost:5000
- Should see: `{"message":"SkillSphere API is running",...}`

### Check Frontend
- Open: http://localhost:3000
- Should see: Beautiful login page with purple gradient

### Check Database
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. After registration, you should see:
   - `users` collection with your user
   - `studentprofiles` collection with your profile
   - `activitylogs` collection with registration log

---

## 🐛 Troubleshooting

### Backend won't start?

**Problem:** MongoDB connection error
```bash
# Solution: Check your .env file
# Make sure MONGODB_URI is correct
# Make sure password doesn't have special characters
```

**Problem:** Port 5000 in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Frontend won't start?

**Problem:** Port 3000 in use
```bash
# It will ask if you want to use another port
# Type 'y' and press Enter
```

### Can't login/register?

**Solution:**
1. Check if backend is running (Terminal 1)
2. Check browser console for errors (F12)
3. Clear localStorage: Open console and type:
   ```javascript
   localStorage.clear()
   ```
4. Refresh page

---

## 📱 URLs Reference

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:5000 | Express API |
| Login Page | http://localhost:3000/login | User login |
| Register Page | http://localhost:3000/register | User registration |
| Dashboard | http://localhost:3000/dashboard | User dashboard |

---

## 🎨 What You Built

### Backend Features ✅
- ✅ Express.js server
- ✅ MongoDB Atlas connection
- ✅ User authentication (JWT)
- ✅ Password hashing (bcryptjs)
- ✅ Input validation
- ✅ Activity logging
- ✅ Role-based access (student/admin)
- ✅ RESTful API endpoints

### Frontend Features ✅
- ✅ Modern React app
- ✅ Beautiful UI with gradients
- ✅ Responsive design
- ✅ Login page
- ✅ Registration page
- ✅ Dashboard page
- ✅ Protected routes
- ✅ Context API for state
- ✅ Axios for API calls

### Database Collections ✅
- ✅ users
- ✅ studentprofiles
- ✅ activitylogs

---

## 🚀 Next Steps (Optional)

After basic auth works, you can add:

1. **Profile Management**
   - Edit profile page
   - Add/remove skills
   - Add/remove projects

2. **Skill Framework**
   - Admin: Define required skills for roles
   - Student: Compare skills with requirements

3. **Recommendations**
   - Course suggestions based on skill gaps
   - Project ideas for domains

4. **Analytics**
   - Readiness score calculation
   - Skill gap visualization
   - Progress tracking

---

## 💡 Quick Tips

1. **Keep both terminals running** (backend + frontend)
2. **Check terminal for errors** if something doesn't work
3. **Use browser console** (F12) to debug frontend issues
4. **MongoDB Atlas** has a nice UI to view your data
5. **Postman** is great for testing API endpoints directly

---

## 🆘 Need More Help?

- Read `README.md` for full documentation
- Read `SETUP_INSTRUCTIONS.md` for detailed setup
- Read `backend/MONGODB_SETUP.md` for MongoDB help
- Read `backend/README.md` for API documentation

---

**That's it! You're ready to run SkillSphere! 🎉**

**Happy Hacking! 🚀**
