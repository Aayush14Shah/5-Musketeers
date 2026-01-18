# Backend - SkillSphere API

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📁 Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   ├── StudentProfile.js  # Student profile schema
│   └── ActivityLog.js     # Activity logging schema
├── routes/
│   └── auth.js            # Authentication routes
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── server.js              # Express server entry point
├── .env                   # Environment variables
└── package.json
```

## 🔐 Environment Variables

Create a `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsphere?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "domainInterest": "healthcare",
  "role": "student"
}
```

**Response:**
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "domainInterest": "healthcare",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "domainInterest": "healthcare",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "domainInterest": "healthcare",
  "createdAt": "2026-01-17T10:00:00.000Z",
  "updatedAt": "2026-01-17T10:00:00.000Z"
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Protected Routes

To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Middleware

- `protect`: Verifies JWT token and adds user to request
- `admin`: Ensures user has admin role
- `student`: Ensures user has student role

## 📊 Database Models

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: Enum ["student", "admin"]
- `domainInterest`: Enum ["healthcare", "agriculture", "urban"]
- `createdAt`: Date
- `updatedAt`: Date

### StudentProfile Model
- `userId`: ObjectId (ref: User)
- `education`: Object
- `skills`: Array of objects
- `projects`: Array of objects
- `careerGoal`: Object
- `lastUpdated`: Date

### ActivityLog Model
- `userId`: ObjectId (ref: User)
- `action`: String
- `ipAddress`: String
- `userAgent`: String
- `metadata`: Mixed
- `createdAt`: Date

## 🧪 Testing with Postman

1. Import the API endpoints
2. Create a new user via `/api/auth/register`
3. Copy the token from the response
4. Use the token in Authorization header for protected routes

## 🛠️ Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

## 📝 Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire in 30 days
- Activity logs are created for security auditing
- Student profiles are auto-created on registration
