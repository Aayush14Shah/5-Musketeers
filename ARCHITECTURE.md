# 🏗️ SkillSphere Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     http://localhost:3000                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    REACT FRONTEND                               │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Login.js    │  │ Register.js  │  │ Dashboard.js │         │
│  └─────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐          │
│  │         AuthContext (Global State)              │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐          │
│  │      api.js (Axios HTTP Client)                 │          │
│  │  - Adds JWT token to requests                   │          │
│  │  - Handles responses/errors                     │          │
│  └─────────────────────────────────────────────────┘          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ API Calls (JSON)
                         │ Authorization: Bearer <token>
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                  EXPRESS.JS BACKEND                             │
│                  http://localhost:5000                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐          │
│  │              server.js                          │          │
│  │  - CORS middleware                              │          │
│  │  - JSON parser                                  │          │
│  │  - Route handlers                               │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐          │
│  │         routes/auth.js                          │          │
│  │  POST /api/auth/register                        │          │
│  │  POST /api/auth/login                           │          │
│  │  GET  /api/auth/me (protected)                  │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐          │
│  │      middleware/auth.js                         │          │
│  │  - Verify JWT token                             │          │
│  │  - Check user role                              │          │
│  │  - Add user to request                          │          │
│  └─────────────────────────────────────────────────┘          │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐          │
│  │         models/ (Mongoose Schemas)              │          │
│  │  - User.js                                      │          │
│  │  - StudentProfile.js                            │          │
│  │  - ActivityLog.js                               │          │
│  └─────────────────────────────────────────────────┘          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Mongoose ODM
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   MONGODB ATLAS                                 │
│                  (Cloud Database)                               │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   users      │  │ student      │  │  activity    │        │
│  │ collection   │  │ profiles     │  │  logs        │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

### Registration Flow

```
User Browser                React App              Backend API           MongoDB
     │                          │                       │                   │
     │  1. Fill form            │                       │                   │
     │  (name, email, pwd)      │                       │                   │
     ├─────────────────────────>│                       │                   │
     │                          │                       │                   │
     │                          │  2. POST /register    │                   │
     │                          │  {name, email, ...}   │                   │
     │                          ├──────────────────────>│                   │
     │                          │                       │                   │
     │                          │                       │  3. Check if      │
     │                          │                       │     user exists   │
     │                          │                       ├──────────────────>│
     │                          │                       │<──────────────────┤
     │                          │                       │                   │
     │                          │                       │  4. Hash password │
     │                          │                       │     (bcryptjs)    │
     │                          │                       │                   │
     │                          │                       │  5. Create user   │
     │                          │                       ├──────────────────>│
     │                          │                       │<──────────────────┤
     │                          │                       │                   │
     │                          │                       │  6. Create        │
     │                          │                       │     student       │
     │                          │                       │     profile       │
     │                          │                       ├──────────────────>│
     │                          │                       │<──────────────────┤
     │                          │                       │                   │
     │                          │                       │  7. Log activity  │
     │                          │                       ├──────────────────>│
     │                          │                       │<──────────────────┤
     │                          │                       │                   │
     │                          │  8. Generate JWT      │                   │
     │                          │     token             │                   │
     │                          │                       │                   │
     │                          │  9. Return user +     │                   │
     │                          │     token             │                   │
     │                          │<──────────────────────┤                   │
     │                          │                       │                   │
     │  10. Save to localStorage│                       │                   │
     │      & Context           │                       │                   │
     │                          │                       │                   │
     │  11. Redirect to         │                       │                   │
     │      Dashboard           │                       │                   │
     │<─────────────────────────┤                       │                   │
```

### Login Flow

```
User Browser                React App              Backend API           MongoDB
     │                          │                       │                   │
     │  1. Enter email/pwd      │                       │                   │
     ├─────────────────────────>│                       │                   │
     │                          │                       │                   │
     │                          │  2. POST /login       │                   │
     │                          │  {email, password}    │                   │
     │                          ├──────────────────────>│                   │
     │                          │                       │                   │
     │                          │                       │  3. Find user     │
     │                          │                       │     by email      │
     │                          │                       ├──────────────────>│
     │                          │                       │<──────────────────┤
     │                          │                       │                   │
     │                          │                       │  4. Compare       │
     │                          │                       │     password      │
     │                          │                       │     (bcryptjs)    │
     │                          │                       │                   │
     │                          │                       │  5. Log activity  │
     │                          │                       ├──────────────────>│
     │                          │                       │<──────────────────┤
     │                          │                       │                   │
     │                          │  6. Generate JWT      │                   │
     │                          │     token             │                   │
     │                          │                       │                   │
     │                          │  7. Return user +     │                   │
     │                          │     token             │                   │
     │                          │<──────────────────────┤                   │
     │                          │                       │                   │
     │  8. Save to localStorage │                       │                   │
     │     & Context            │                       │                   │
     │                          │                       │                   │
     │  9. Redirect to          │                       │                   │
     │     Dashboard            │                       │                   │
     │<─────────────────────────┤                       │                   │
```

### Protected Route Access

```
User Browser                React App              Backend API           MongoDB
     │                          │                       │                   │
     │  1. Access /dashboard    │                       │                   │
     ├─────────────────────────>│                       │                   │
     │                          │                       │                   │
     │                          │  2. Check if token    │                   │
     │                          │     exists in         │                   │
     │                          │     localStorage      │                   │
     │                          │                       │                   │
     │  3. If no token:         │                       │                   │
     │     Redirect to /login   │                       │                   │
     │<─────────────────────────┤                       │                   │
     │                          │                       │                   │
     │  4. If token exists:     │                       │                   │
     │     GET /api/auth/me     │                       │                   │
     │     Authorization:       │                       │                   │
     │     Bearer <token>       │                       │                   │
     │                          ├──────────────────────>│                   │
     │                          │                       │                   │
     │                          │                       │  5. Verify JWT    │
     │                          │                       │     signature     │
     │                          │                       │                   │
     │                          │                       │  6. Find user     │
     │                          │                       │     by ID         │
     │                          │                       ├──────────────────>│
     │                          │                       │<──────────────────┤
     │                          │                       │                   │
     │                          │  7. Return user data  │                   │
     │                          │<──────────────────────┤                   │
     │                          │                       │                   │
     │  8. Render Dashboard     │                       │                   │
     │     with user data       │                       │                   │
     │<─────────────────────────┤                       │                   │
```

---

## 📦 Data Flow

### Frontend State Management

```
┌─────────────────────────────────────────────┐
│          AuthContext (Global)               │
│                                             │
│  State:                                     │
│  - user: { _id, name, email, role, ... }   │
│  - loading: boolean                         │
│  - isAuthenticated: boolean                 │
│                                             │
│  Methods:                                   │
│  - login(userData, token)                   │
│  - logout()                                 │
└─────────────────────────────────────────────┘
              │
              │ Provides to all components
              │
    ┌─────────┴─────────┬─────────────┐
    │                   │             │
┌───▼────┐      ┌───────▼──┐    ┌────▼─────┐
│ Login  │      │ Register │    │Dashboard │
└────────┘      └──────────┘    └──────────┘
```

### API Request Flow

```
Component
   │
   │ 1. Call API function
   │    authAPI.login(credentials)
   │
   ▼
api.js (Axios)
   │
   │ 2. Add JWT token to header
   │    Authorization: Bearer <token>
   │
   │ 3. Send HTTP request
   │
   ▼
Backend Route
   │
   │ 4. Validate input
   │    (express-validator)
   │
   ▼
Middleware (if protected)
   │
   │ 5. Verify JWT token
   │    Extract user from token
   │
   ▼
Controller Logic
   │
   │ 6. Business logic
   │    Query database
   │
   ▼
MongoDB
   │
   │ 7. Return data
   │
   ▼
Response
   │
   │ 8. Send JSON response
   │
   ▼
api.js
   │
   │ 9. Handle response
   │    Update state
   │
   ▼
Component
   │
   │ 10. Update UI
```

---

## 🔐 Security Architecture

### Password Security

```
User Password
     │
     │ 1. User enters password
     │
     ▼
Frontend
     │
     │ 2. Send to backend (HTTPS in production)
     │
     ▼
Backend
     │
     │ 3. bcrypt.genSalt(10)
     │    Generate random salt
     │
     ▼
     │ 4. bcrypt.hash(password, salt)
     │    Create hash
     │
     ▼
MongoDB
     │
     │ 5. Store hashed password
     │    Never store plain text!
```

### JWT Token Flow

```
Login Success
     │
     │ 1. Generate JWT
     │    jwt.sign({ id: user._id }, SECRET, { expiresIn: '30d' })
     │
     ▼
Token Structure:
┌─────────────────────────────────────┐
│ Header                              │
│ { alg: "HS256", typ: "JWT" }       │
├─────────────────────────────────────┤
│ Payload                             │
│ { id: "user_id", iat: ..., exp: ...}│
├─────────────────────────────────────┤
│ Signature                           │
│ HMACSHA256(header + payload, SECRET)│
└─────────────────────────────────────┘
     │
     │ 2. Send to frontend
     │
     ▼
Frontend
     │
     │ 3. Store in localStorage
     │
     ▼
Subsequent Requests
     │
     │ 4. Add to Authorization header
     │    Authorization: Bearer <token>
     │
     ▼
Backend Middleware
     │
     │ 5. Verify signature
     │    jwt.verify(token, SECRET)
     │
     │ 6. Extract user ID
     │    decoded.id
     │
     │ 7. Find user in database
     │
     ▼
Protected Resource Access
```

---

## 🗂️ File Dependencies

### Backend Dependencies

```
server.js
  ├── config/db.js
  │     └── mongoose
  │
  ├── routes/auth.js
  │     ├── models/User.js
  │     ├── models/StudentProfile.js
  │     ├── models/ActivityLog.js
  │     ├── middleware/auth.js
  │     ├── jsonwebtoken
  │     └── express-validator
  │
  ├── express
  ├── cors
  └── dotenv
```

### Frontend Dependencies

```
index.js
  └── App.js
        ├── context/AuthContext.js
        │     └── services/api.js
        │           └── axios
        │
        ├── pages/Login.js
        │     ├── context/AuthContext.js
        │     ├── services/api.js
        │     └── styles/Auth.css
        │
        ├── pages/Register.js
        │     ├── context/AuthContext.js
        │     ├── services/api.js
        │     └── styles/Auth.css
        │
        ├── pages/Dashboard.js
        │     └── context/AuthContext.js
        │
        ├── components/PrivateRoute.js
        │     └── context/AuthContext.js
        │
        └── react-router-dom
```

---

## 🌐 Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Development Setup                    │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Frontend       │         │    Backend       │
│   localhost:3000 │◄───────►│ localhost:5000   │
│   (React Dev     │  CORS   │  (Express)       │
│    Server)       │ Enabled │                  │
└──────────────────┘         └────────┬─────────┘
                                      │
                                      │ Mongoose
                                      │
                             ┌────────▼─────────┐
                             │  MongoDB Atlas   │
                             │  (Cloud)         │
                             │  cluster.mongodb │
                             │  .net            │
                             └──────────────────┘
```

---

## 📊 Database Relationships

```
┌─────────────────┐
│     users       │
│                 │
│ _id (PK)       │◄────────┐
│ name            │         │
│ email           │         │ userId (FK)
│ password        │         │
│ role            │         │
│ domainInterest  │    ┌────┴──────────────┐
└─────────────────┘    │ studentprofiles   │
        │              │                   │
        │              │ _id (PK)         │
        │ userId (FK)  │ userId (FK)      │
        │              │ education         │
        │              │ skills []         │
        │              │ projects []       │
        │              │ careerGoal        │
        │              └───────────────────┘
        │
        │
    ┌───▼──────────────┐
    │  activitylogs    │
    │                  │
    │ _id (PK)        │
    │ userId (FK)     │
    │ action          │
    │ ipAddress       │
    │ timestamp       │
    └──────────────────┘
```

---

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                   Production Setup                      │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Frontend       │         │    Backend       │
│   Vercel/Netlify │◄───────►│ Heroku/Railway   │
│   (Static)       │  HTTPS  │  (Node.js)       │
└──────────────────┘         └────────┬─────────┘
                                      │
                                      │ SSL/TLS
                                      │
                             ┌────────▼─────────┐
                             │  MongoDB Atlas   │
                             │  (Production)    │
                             └──────────────────┘

Environment Variables:
- Frontend: REACT_APP_API_URL=https://api.skillsphere.com
- Backend: MONGODB_URI=mongodb+srv://...
           JWT_SECRET=...
           NODE_ENV=production
```

---

This architecture provides a solid foundation for the SkillSphere application with clear separation of concerns, security best practices, and scalability in mind.
