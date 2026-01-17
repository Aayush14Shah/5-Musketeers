# 🎯 Skill Framework Generator - Documentation

## Overview

The Skill Framework Generator is an intelligent system that automatically creates skill frameworks from CSV datasets. Instead of manually adding skills, admins can upload a CSV file that gets parsed and transformed into structured skill frameworks in the database.

## How It Works

### Step 1: CSV Upload
Admin uploads a CSV file through the Admin Dashboard with the following structure:

| Column Name | Description | Example |
|------------|-------------|---------|
| `job_title` | Job role name | "Data Scientist" |
| `category` | Domain/sector | "Healthcare" |
| `easy_skills` | Beginner skills (comma-separated) | "Python, SQL, Excel" |
| `medium_skills` | Intermediate skills (comma-separated) | "Machine Learning, Data Analysis" |
| `hard_skills` | Advanced skills (comma-separated) | "Deep Learning, Neural Networks" |

### Step 2: Data Parsing
The system automatically:
1. **Extracts Categories**: Finds unique categories from the `category` column
2. **Parses Skills**: Splits comma-separated skills into individual items
3. **Maps Importance Levels**:
   - `easy_skills` → `importance: 2` (beginner)
   - `medium_skills` → `importance: 3` (intermediate)
   - `hard_skills` → `importance: 5` (advanced)

### Step 3: Framework Generation
For each row in the CSV:
- Creates a `SkillFramework` document with:
  - `roleName`: From `job_title`
  - `domain`: From `category` (lowercased)
  - `skills`: Array of skill objects with name, importance, and category
  - `totalSkills`: Count of skills

### Step 4: Database Storage
- **Categories** are saved to the `Category` collection
- **Skill Frameworks** are saved to the `SkillFramework` collection
- Duplicate frameworks (same roleName + domain) are updated, not duplicated

## Database Schema

### SkillFramework Model
```javascript
{
  roleName: "Data Scientist",
  domain: "healthcare",
  skills: [
    {
      name: "Python",
      importance: 2,  // easy
      category: "easy"
    },
    {
      name: "Machine Learning",
      importance: 3,  // medium
      category: "medium"
    },
    {
      name: "Deep Learning",
      importance: 5,  // hard
      category: "hard"
    }
  ],
  totalSkills: 3,
  source: "csv_upload",
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Admin Endpoints (Protected)
- `POST /api/admin/upload-csv` - Upload CSV and generate frameworks
- `GET /api/admin/frameworks` - Get all frameworks (admin only)
- `GET /api/admin/frameworks/:id` - Get specific framework
- `DELETE /api/admin/frameworks/:id` - Delete framework

### Public Endpoints
- `GET /api/frameworks` - Get all frameworks (for users)
- `GET /api/frameworks/:id` - Get specific framework
- `GET /api/frameworks/domain/:domain` - Get frameworks by domain

## CSV Format Example

```csv
job_title,category,easy_skills,medium_skills,hard_skills
Data Scientist,Healthcare,Python SQL Excel,Machine Learning Data Analysis,Deep Learning Neural Networks
Full Stack Developer,Technology,HTML CSS JavaScript,React Node.js,Microservices Docker Kubernetes
Data Analyst,Finance,Excel SQL,Python Pandas,Advanced Statistics Machine Learning
```

## Response Format

After successful upload:
```json
{
  "message": "CSV file processed successfully",
  "categoriesCount": 3,
  "categories": [...],
  "frameworksCount": 15,
  "frameworks": [
    {
      "id": "...",
      "roleName": "Data Scientist",
      "domain": "healthcare",
      "totalSkills": 8
    }
  ],
  "errors": [] // If any frameworks failed to save
}
```

## Features

### ✅ Automatic Category Extraction
- Extracts unique categories from CSV
- Saves to Category collection
- Updates existing categories

### ✅ Skill Framework Generation
- Creates frameworks for each job role
- Maps skills by difficulty level
- Handles duplicate roles (updates existing)

### ✅ Data Validation
- Checks for required columns
- Validates skill data
- Handles missing or empty fields gracefully

### ✅ Error Handling
- Reports which frameworks failed
- Continues processing even if some rows fail
- Provides detailed error messages

## Usage Flow

1. **Admin logs in** → Goes to Admin Dashboard
2. **Clicks "Upload Data" tab**
3. **Uploads CSV file** with job data
4. **System processes**:
   - Extracts categories
   - Generates skill frameworks
   - Saves to database
5. **Admin views results**:
   - See categories in "Categories" tab
   - See frameworks in "Skill Frameworks" tab
6. **Users can access** frameworks through public API

## Benefits

1. **Automation**: No manual data entry needed
2. **Scalability**: Process hundreds of roles at once
3. **Consistency**: Standardized skill importance levels
4. **Data-Driven**: Uses real job market data
5. **Flexibility**: Easy to update by re-uploading CSV

## Future Enhancements

- Skill gap analysis (compare user skills vs. role requirements)
- Learning path recommendations
- Role matching based on user skills
- Progress tracking toward role requirements
- Export frameworks to CSV
- Bulk framework editing

## Technical Details

### Column Detection
The system uses case-insensitive matching for column names:
- `job_title`, `job title`, `role` → job_title
- `category`, `domain`, `sector` → category
- `easy_skills`, `easy skills` → easy_skills
- `medium_skills`, `medium skills` → medium_skills
- `hard_skills`, `hard skills` → hard_skills

### Skill Parsing
- Splits by comma
- Trims whitespace
- Filters empty strings
- Preserves original skill names

### Importance Mapping
- Easy skills: `importance: 2` (beginner level)
- Medium skills: `importance: 3` (intermediate level)
- Hard skills: `importance: 5` (advanced level)

This creates a clear skill progression path for users.
