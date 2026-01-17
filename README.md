# 🎓 SkillSphere - Holistic Academic & Professional Skill Intelligence System

A hackathon-ready full-stack web application that helps students and early-career professionals understand their skill readiness, identify gaps, and receive personalized learning recommendations for emerging sectors.

## 🎯 Target Domains

- 🏥 **Healthcare Technology**
- 🌾 **Agricultural Technology**
- 🏙️ **Urban / Smart City Systems**

## ✨ Features

### For Students
- ✅ Secure registration and login
- 📝 Create and update personal profile
- 🎯 Add skills with proficiency levels
- 💼 Add projects and learning experiences
- 🎓 Select career goals (domain + role)
- 📊 View skill gap analysis
- 📈 View readiness score
- 🎓 Get personalized course & project recommendations
- 📊 Progress dashboard

### For Admins
- 🔐 Admin login
- 🛠️ Define skill frameworks for roles
- 🗺️ Define domain-specific career paths
- 📚 Manage recommended courses/projects
- 📊 View system analytics
- 👥 Manage users

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** 19.2.3
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management
- Modern CSS with responsive design

## 📁 Project Structure

```
AU_Hackathon_SkillSphere/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── StudentProfile.js     # Student profile model
│   │   └── ActivityLog.js        # Activity logging model
│   ├── routes/
│   │   └── auth.js               # Authentication routes
│   ├── middleware/
│   │   └── auth.js               # Auth middleware
│   ├── server.js                 # Express server
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── MONGODB_SETUP.md          # MongoDB Atlas setup guide
│
└── skillsphere/                  # React frontend
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.js   # Protected route component
    │   ├── context/
    │   │   └── AuthContext.js    # Authentication context
    │   ├── pages/
    │   │   ├── Login.js          # Login page
    │   │   ├── Register.js       # Registration page
    │   │   └── Dashboard.js      # Dashboard page
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── styles/
    │   │   └── Auth.css          # Authentication styles
    │   ├── App.js                # Main app component
    │   └── index.js              # Entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AU_Hackathon_SkillSphere
```

### 2. Setup MongoDB Atlas

Follow the detailed guide in `backend/MONGODB_SETUP.md` to:
1. Create a MongoDB Atlas account
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already created, just update it)
# Edit backend/.env and add your MongoDB connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsphere?retryWrites=true&w=majority

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000
```

### 4. Setup Frontend

Open a new terminal:

```bash
cd skillsphere

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will run on `http://localhost:3000`

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Request Examples

**Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "domainInterest": "healthcare"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ["student", "admin"],
  domainInterest: ["healthcare", "agriculture", "urban"],
  createdAt: Date,
  updatedAt: Date
}
```

### Student Profiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  education: {
    institution: String,
    degree: String,
    field: String,
    graduationYear: Number
  },
  skills: [{
    name: String,
    level: ["beginner", "intermediate", "advanced", "expert"],
    addedAt: Date
  }],
  projects: [{
    title: String,
    description: String,
    domain: ["healthcare", "agriculture", "urban", "other"],
    technologies: [String],
    link: String,
    startDate: Date,
    endDate: Date
  }],
  careerGoal: {
    domain: ["healthcare", "agriculture", "urban"],
    role: String
  },
  lastUpdated: Date
}
```

### Activity Logs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  action: ["login", "logout", "register", "profile_update", ...],
  ipAddress: String,
  userAgent: String,
  metadata: Mixed,
  createdAt: Date
}
```

## 🎨 Features Implemented

- ✅ Beautiful, modern UI with gradient backgrounds
- ✅ Responsive design (mobile-friendly)
- ✅ Secure authentication with JWT
- ✅ Password hashing with bcryptjs
- ✅ Input validation
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Activity logging
- ✅ Error handling
- ✅ Loading states
- ✅ Context API for state management

## 🔜 Next Steps (To Be Implemented)

1. **Student Profile Management**
   - Add/edit skills
   - Add/edit projects
   - Update education details

2. **Skill Gap Analysis**
   - Compare user skills with role requirements
   - Calculate readiness score
   - Identify missing skills

3. **Recommendation Engine**
   - Course recommendations
   - Project recommendations
   - Learning path suggestions

4. **Admin Dashboard**
   - Define skill frameworks
   - Manage career paths
   - View analytics

5. **Visualizations**
   - Skill radar charts
   - Progress tracking
   - Career roadmap visualization

## 🧪 Testing the Application

### Test User Registration
1. Navigate to `http://localhost:3000/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Domain: Select any domain
3. Click "Create Account"
4. You should be redirected to the dashboard

### Test User Login
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"
4. You should be redirected to the dashboard

### Create Admin User
Use a tool like Postman or directly in MongoDB Atlas:
```json
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@skillsphere.com",
  "password": "admin123",
  "role": "admin",
  "domainInterest": "healthcare"
}
```

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check if port 5000 is already in use

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Clear browser cache and localStorage

### Authentication errors
- Clear localStorage: `localStorage.clear()` in browser console
- Check JWT_SECRET in `.env`
- Verify user exists in MongoDB Atlas

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

## 📄 License

MIT License

## 👥 Team

Built for AU Hackathon - SkillSphere Team

---

**Happy Coding! 🚀**
