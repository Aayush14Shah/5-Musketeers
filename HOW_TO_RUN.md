# 🚀 How to Run SkillSphere (Simple Version)

## ✅ What You Have Now
- ✅ Simple Login Page
- ✅ Simple Registration Page  
- ✅ Backend API with MongoDB
- ✅ No complex routing, no dashboard

---

## 📋 Step 1: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE account
3. Create FREE cluster (M0)
4. Create database user (username: `skillsphere_admin`, password: `skillsphere123`)
5. Whitelist IP: Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string

---

## 📋 Step 2: Configure Backend

Edit `backend/.env`:

```env
MONGODB_URI=mongodb+srv://skillsphere_admin:skillsphere123@cluster0.xxxxx.mongodb.net/skillsphere?retryWrites=true&w=majority
JWT_SECRET=skillsphere_hackathon_jwt_secret_key_2026
PORT=5000
NODE_ENV=development
```

(Replace with your actual MongoDB connection string)

---

## 🚀 Step 3: Run Backend

Open **Terminal 1**:

```bash
cd backend
npm install
npm run dev
```

✅ You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000
```

---

## 🚀 Step 4: Run Frontend

Open **Terminal 2** (NEW terminal):

```bash
cd skillsphere
npm start
```

✅ Browser opens at http://localhost:3000

---

## 🎯 How to Test

1. **Registration:**
   - Fill in name, email, password
   - Click on a domain (Healthcare/Agriculture/Smart Cities)
   - Click "Create Account"
   - You'll see success message!

2. **Login:**
   - Click "Sign in here" link
   - Enter email and password
   - Click "Sign In"
   - You'll see success message!

3. **Check Data:**
   - Go to MongoDB Atlas
   - Click "Browse Collections"
   - See your user in `users` collection

---

## 📱 What Happens

- **Register:** Creates user in MongoDB, shows success message
- **Login:** Validates credentials, saves token to localStorage, shows success

---

## ⚡ Quick Commands

### Backend
```bash
cd backend
npm run dev     # Start backend with auto-reload
```

### Frontend  
```bash
cd skillsphere
npm start       # Start React app
```

---

## 🐛 If Something Goes Wrong

### Backend won't start?
- Check MongoDB connection string in `backend/.env`
- Make sure IP is whitelisted in MongoDB Atlas

### Frontend shows errors?
- Make sure backend is running first
- Check if axios and react-router-dom are installed:
  ```bash
  cd skillsphere
  npm install axios react-router-dom
  ```d

### Can't register/login?
- Check browser console (F12) for errors
- Make sure backend is running on port 5000

---

## 🎉 That's It!

Super simple - just 2 pages:
- Login page
- Registration page

Both work with your MongoDB backend!
