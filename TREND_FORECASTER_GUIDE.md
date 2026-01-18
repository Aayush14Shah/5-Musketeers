# 📈 Real-Time Emerging Trend Forecaster

This feature analyzes job market data to spot emerging IT skills and roles using the Google Jobs API (via SerpAPI).

## 🚀 How to Use

1.  **Navigate to Dashboard**: Log in as a student (or use the test account).
2.  **Open "Market Trends"**: Click the new "Market Trends" (🔥) tab in the sidebar.
3.  **View Data**: You will see pre-populated data (or dummy data for the first run).
4.  **Refresh Analysis**: Click the "Refresh Analysis" button to fetch real-time data from Google Jobs. *Note: This calls the SerpAPI and updates the database.*

## 📡 API Endpoints

### 1. Trigger Analysis
**POST** `/api/trends/refresh`
Triggers the backend to fetch new job data, extract skills, and update trend scores.

**Response:**
```json
{
  "message": "Trends updated successfully",
  "data": {
    "roleCounts": {
      "Software Engineer": 15,
      "Data Analyst": 8
    },
    "skillCounts": {
      "React": 12,
      "Python": 10,
      "AWS": 8
    }
  }
}
```

### 2. Get Emerging Trends
**GET** `/api/trends/emerging`
Returns skills/roles classified as "Fast Rising" (>50% growth) or "Rising".

**Response:**
```json
[
  {
    "_id": "65a5f...",
    "name": "Rust",
    "type": "skill",
    "currentCount": 45,
    "previousCount": 20,
    "trendScore": 1.25,
    "trendType": "Fast Rising",
    "lastUpdated": "2026-01-18T10:00:00.000Z"
  }
]
```

### 3. Get All Skill Trends
**GET** `/api/trends/skills`
Returns all tracked skills sorted by popularity.

**Response:**
```json
[
  {
    "name": "React",
    "currentCount": 150,
    "trendType": "Stable"
  },
  {
    "name": "Docker",
    "currentCount": 120,
    "trendType": "Rising"
  }
]
```

## 🛠️ Implementation Details

*   **Backend**: `trendAnalyzeService.js` fetches data and calculates `trendScore = (current - prev) / prev`.
*   **Database**: MongoDB stores history in the `JobTrend` collection.
*   **Frontend**: `TrendsView.js` visualizes data using Recharts (Line/Bar charts).
*   **Mock History**: On the very first run, the system generates a "mock" previous record to allow immediate calculation of growth trends for demo purposes.

## ⚠️ Important
**Restart your Backend Server**: Since we added a new `.env` variable (`SERPAPI_KEY`), you **MUST** restart your backend terminal (`Ctrl+C` then `npm run dev`) for the API key to be loaded.
