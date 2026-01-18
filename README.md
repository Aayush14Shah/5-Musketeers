# 🎓 SkillSphere - Holistic Skill Intelligence System

SkillSphere is a full-stack web application designed to help students and early-career professionals assess their skill readiness, identify gaps, and receive personalized learning recommendations. SkillSphere bridges the gap between academic foundations and industry requirements.

## ✨ Features
*   **For Students:**
    *   **Skill Gap Analysis:** Visualize the difference between current skills and role requirements.
    *   **Personalized Dashboard:** Track progress, readiness scores, and career goals.
    *   **Recommendations:** tailored suggestions for courses and projects.
    *   **Profile Management:** Add education, projects, and skills easily.
*   **For Admins:**
    *   **Framework Management:** Define skills and career paths for different domains.
    *   **User Oversight:** Manage users and view platform analytics.
    *   **Content Management:**  Update recommended courses and projects.

## 🛠️ Tech Stack
**Frontend:**
*   **React.js** (v19) with Hooks & Context API
*   **Tailwind CSS / CSS Modules** for clean, custom styling
*   **Axios** for API integration

**Backend:**
*   **Node.js & Express.js** for robust API handling
*   **MongoDB & Mongoose** for scalable data storage
*   **JWT (JSON Web Tokens)** for secure stateless authentication
*   **Bcryptjs** for password hashing

## 🚀 Setup Steps & How to Run Locally

Follow these steps to get the application up and running on your local machine.

### Prerequisites
*   Node.js (v16+) installed
*   MongoDB installed locally or a MongoDB Atlas account

### 1. Clone the Repository
```bash
git clone https://github.com/Aayush14Shah/5-Musketeers
cd AU_Hackathon_SkillSphere
```

### 2. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (see Environment Variables section below).
4.  Start the server:
    ```bash
    npm run dev
    ```
    *Server will start on `http://localhost:5000`*

### 3. Frontend Setup
1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd skillsphere
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the application:
    ```bash
    npm start
    ```
    *Application will open at `http://localhost:3000`*

## 📝 Environment Variable Examples

Create a `.env` file inside the `backend/` directory. Copy the structure below:

```env
# Database Connection (Required)
MONGODB_URI=mongodb+srv://kirtan0318_db_user:f8lmehieU39oz7I4@cluster0.tmccmey.mongodb.net/skillsphere?retryWrites=true&w=majority&appName=Cluster0

# Security Key (Required)
JWT_SECRET=skillsphere_hackathon_jwt_secret_key_2026

# Server Port (Optional, Default: 5000)
PORT=5000

# Environment (Optional, Default: development)
NODE_ENV=development
```

## 🔐 Test Login Credentials

Since the database is local to your environment (or your private Atlas cluster), **there are no pre-existing accounts.**

To test the application:
1.  **Register a New User:**
    *   Go to the Register page (`/register`).
    *   Sign up with any email (e.g., `test@example.com`) and password.
    *   This account will have **Student** access by default.

2.  **To Create an Admin:**
    *   You can manually update the user's `role` to `admin` in your MongoDB database *OR*
    *   Use an API tool (like Postman) to `POST /api/auth/register` with a `"role": "admin"` field in the JSON body.

## ⚠️ Basic Error Handling

The application relies on standard HTTP status codes and JSON error responses:
*   **400 Bad Request:** Missing fields or invalid input (e.g., email already exists).
*   **401 Unauthorized:** Invalid login credentials or missing authentication token.
*   **500 Internal Server Error:** Unexpected server-side issues.

On the frontend, these errors are caught and displayed to the user via toast notifications or inline error messages to ensure a smooth user experience.

## ✅ Confirmation of No Secrets

**This repository does NOT contain any secrets, API keys, or private credentials.**
*   The `.env` file is included in `.gitignore`.
*   All sensitive configuration must be provided via environment variables during setup.
