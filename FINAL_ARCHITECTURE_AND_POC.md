# 🏗️ Final System Architecture Diagram

This diagram represents the final state of the SkillSphere platform, including the Frontend, Backend, Database, and Recommendation Engine.

```mermaid
graph TD
    subgraph Client_Side [Client Side - React Frontend]
        UI[User Interface - React/Tailwind]
        AuthC[AuthContext - State Management]
        Axios[Axios - API Client]
        
        UI --> AuthC
        AuthC --> Axios
    end

    subgraph Server_Side [Server Side - Node.js/Express]
        Server[server.js - Entry Point]
        AuthR[Auth Routes]
        AdminR[Admin Routes]
        StudentR[Student Routes]
        ML[KNN Recommender Engine - Pure JS]
        JWT[JWT Authentication Middleware]
        
        Axios --> Server
        Server --> AuthR
        Server --> AdminR
        Server --> StudentR
        
        AdminR --> JWT
        StudentR --> JWT
        StudentR --> ML
    end

    subgraph Data_Layer [Data Layer - MongoDB Atlas]
        Users[(Users Collection)]
        Profiles[(Student Profiles)]
        Courses[(Courses/Resources)]
        Logs[(Activity Logs)]
        
        AuthR --> Users
        StudentR --> Profiles
        AdminR --> Courses
        Server --> Logs
    end

    subgraph ML_Logic [ML Logic - Custom KNN]
        FV[Feature Vectorization]
        CS[Cosine Similarity]
        ED[Euclidean Distance]
        WS[Weighted Scoring]
        
        ML --> FV
        FV --> CS
        FV --> ED
        CS --> WS
        ED --> WS
        WS --> Profiles
    end

    style Client_Side fill:#f9f,stroke:#333,stroke-width:2px
    style Server_Side fill:#bbf,stroke:#333,stroke-width:2px
    style Data_Layer fill:#dfd,stroke:#333,stroke-width:2px
    style ML_Logic fill:#ffd,stroke:#333,stroke-width:2px
```

---

# 🚀 Proof of Concept (POC) Flow

The POC demonstrates the end-to-end journey of a student from profile creation to receiving personalized career recommendations.

```mermaid
sequenceDiagram
    participant S as Student
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant ML as KNN Recommender
    participant DB as MongoDB

    S->>F: Register/Login
    F->>B: POST /api/auth/login
    B->>DB: Verify Credentials
    DB-->>B: User Data
    B-->>F: JWT Token + User Info
    
    S->>F: Complete Profile (Skills & Interests)
    F->>B: POST /api/students/profile
    B->>DB: Save Profile
    
    S->>F: Request Recommendations
    F->>B: GET /api/recommendations
    B->>ML: Run KNN Algorithm
    ML->>DB: Fetch Course/Project Data
    DB-->>ML: Raw Data
    ML->>ML: Vectorize & Calculate Similarity
    ML-->>B: Top N Recommendations
    B-->>F: JSON (Recommended Courses/Projects)
    F-->>S: Display Personalized Path
```
