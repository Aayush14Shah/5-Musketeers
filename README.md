# 🎓 SkillSphere - Holistic Skill Intelligence System

**SkillSphere** is a full-stack web platform that empowers students and early-career professionals to assess their employability skills, identify development gaps, and receive actionable, domain-specific learning recommendations. It also provides administrative tools for institutions and educators to define skill frameworks, manage users, and oversee learning progress and analytics.

---

## 🚩 What Problem Does It Solve?

- **For Students:** Removing the guesswork from preparation for roles in industries like healthcare, agriculture, urban planning, and beyond. Students can benchmark themselves, set development goals, and follow a clear path toward employability.
- **For Admins:** Define role-specific skill requirements, observe learning trends, manage frameworks, and keep content recommendations up-to-date.

---

## ✨ Major Features

### For Students
- **Skill Gap Analysis:** Visualize current skill levels versus role or career requirements.
- **Personalized Dashboard:** Track readiness, progress, and set career goals.
- **Intelligent Recommendations:** AI-assisted suggestions for learning resources and hands-on projects.
- **Dynamic Profile Management:** Maintain education history, update new skills, and showcase projects seamlessly.

### For Admins
- **Framework & Path Management:** Build and update the rules for employability across different domains.
- **User Oversight:** View students' progress, analytics, and manage the platform's user base.
- **Content Updating:** Curate, add, or remove recommended resources as industry standards evolve.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (v19) with Hooks & Context API
- **Styled with CSS/CSS Modules** for a clean, responsive interface
- **Axios** for reliable API integration

### Backend
- **Node.js & Express.js** for RESTful APIs
- **MongoDB & Mongoose** for robust and scalable data storage
- **JWT (JSON Web Tokens)** for stateless user authentication
- **Bcryptjs** for strong password hashing

---

## 📦 Directory Structure

```
project-root/
├── backend/         # Backend API (Node, Express)
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── skillsphere/     # React Frontend
├── README.md
└── ...
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### 2. Clone the Repository
```bash
git clone https://github.com/Aayush14Shah/5-Musketeers
cd 5-Musketeers
```

### 3. Backend Setup
```bash
cd backend
npm install
# Create .env as described below
npm run dev
# Server starts at http://localhost:5000
```

### 4. Frontend Setup
Open a new terminal:
```bash
cd skillsphere
npm install
npm start
# App runs at http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:
```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/skillsphere

# Secret key for JWT
JWT_SECRET=your_secure_random_string_here

# (Optional) Server Port and Environment
PORT=5000
NODE_ENV=development
```

---

## ⚡ API Overview (Backend)

Key endpoints:
- `POST   /api/auth/register`  → Register student/admin (see backend/README.md for details)
- `POST   /api/auth/login`     → Login, receive JWT token
- `GET    /api/auth/me`        → Get current user details (JWT required)
- Roles: `"student"` or `"admin"` in registration to control access

---

## 🧪 Testing

- **Register** any email/password via `/register`.
- **Admin Accounts:** update user `role` to `"admin"` in MongoDB or register with role field in API call.
- **No seeded/test data:** All accounts start fresh per environment.

---

## ❗ Error Handling

Standard HTTP status codes and error messages are implemented for all APIs:
- 400: Bad/Missing parameters
- 401: Unauthorized/JWT required
- 500: Server error

Frontend surfaces these errors with toast notifications or inline messages.

---

## 📊 Security & Data

- Passwords are hashed with bcryptjs
- All authentication is JWT-based (tokens expire in 30 days)
- No secrets or private keys are committed to the repo (`.gitignore` includes `.env`)

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue for significant changes or feature requests.

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**SkillSphere** is developed by the "5 Musketeers" team for educational, non-commercial use.
