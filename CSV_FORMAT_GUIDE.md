# 📊 CSV File Format & Data Structure Guide

**For**: Understanding how CSV data is processed and integrated into SkillSphere

---

## 🎯 Overview

The SkillSphere system uses CSV (Comma-Separated Values) files to import course and skill data. The CSV format allows for easy bulk data import and organization of learning resources.

---

## 📋 Current CSV File

### Location
```
backend/data/courses.csv
```

### Purpose
- Contains 50 sample courses from various platforms
- Defines skills associated with each course
- Organizes courses by domain/category
- Provides course metadata (difficulty, duration, rating, etc.)

---

## 🔍 CSV Column Structure

### Column Headers
```
id, title, platform, url, skills, domain, difficulty, duration_hours, 
rating, reviews_count, price, instructor, description
```

### Detailed Column Descriptions

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| **id** | Integer | 1 | Unique course identifier |
| **title** | String | React - The Complete Guide | Course name |
| **platform** | String | Udemy, Coursera, YouTube | Learning platform |
| **url** | String | https://www.udemy.com/course/... | Course link |
| **skills** | Semicolon-separated | React;JavaScript;Redux;Hooks | Skills taught (semicolon delimited) |
| **domain** | String | web-development, data-science | Category/Domain |
| **difficulty** | String | beginner, intermediate, advanced | Skill level |
| **duration_hours** | Integer | 48 | Course length in hours |
| **rating** | Decimal | 4.7 | Course rating (0-5) |
| **reviews_count** | Integer | 180000 | Number of reviews |
| **price** | String | 0, 15, 99.99 | Course cost (0 = free) |
| **instructor** | String | Maximilian Schwarzmuller | Course instructor name |
| **description** | Text | Dive in and learn React.js... | Course summary |

---

## 📝 CSV Data Format Examples

### Example Row 1: Full Paid Course
```csv
1,React - The Complete Guide (incl Hooks Redux Router),Udemy,https://www.udemy.com/course/react-the-complete-guide,React;JavaScript;Redux;React Router;Hooks,web-development,beginner,48,4.7,180000,Maximilian Schwarzmuller,Dive in and learn React.js from scratch!
```

**Breakdown**:
- ID: 1
- Title: React - The Complete Guide
- Platform: Udemy
- Skills: React, JavaScript, Redux, React Router, Hooks (5 skills)
- Domain: web-development
- Duration: 48 hours
- Rating: 4.7/5
- Instructor: Maximilian Schwarzmuller

### Example Row 2: Free YouTube Course
```csv
16,Python Crash Course,YouTube,https://www.youtube.com/watch?v=rfscVS0vtbw,Python;Programming Basics;Automation,data-science,beginner,4,4.8,2000000,FreeCodeCamp,Learn Python - Full Course for Beginners
```

**Breakdown**:
- ID: 16
- Platform: YouTube (free)
- Duration: 4 hours
- Reviews: 2,000,000 (high engagement)
- Skills: Python, Programming Basics, Automation (3 skills)

---

## 🎓 Supported Domains

The system recognizes these domain categories:

```
✅ web-development          (Frontend, Backend, Full Stack)
✅ data-science             (AI, ML, Analytics)
✅ cloud-computing          (AWS, Azure, GCP)
✅ mobile-development       (iOS, Android, Flutter)
✅ software-engineering     (DevOps, Architecture, Tools)
✅ cybersecurity            (Security, Hacking, Protection)
✅ game-development         (Unity, Unreal, Game Design)
✅ ui-ux-design             (Figma, Design Systems, UX)
```

---

## 🛠️ How CSV Is Processed

### Step 1: File Upload
```
User uploads CSV file via Dashboard
    ↓
File saved to backend/uploads/
    ↓
CSV parsing begins
```

### Step 2: CSV Parsing
```javascript
// CSV is parsed row by row
fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    // Process each row
    // Extract category from domain/skills
    // Parse skills from semicolon-separated string
  })
```

### Step 3: Category Extraction
```javascript
// Categories are extracted from:
// 1. Domain field (web-development → Web Development)
// 2. Skills field (first skill becomes sub-category)

// Example:
Domain: "web-development"
Skills: "React;JavaScript;Redux"
    ↓
Creates Category: "Web Development"
With Job Role: "React Developer"
Required Skills: [React, JavaScript, Redux]
```

### Step 4: Skill Framework Generation
```javascript
// For each unique skill combination:
// 1. Create SkillFramework document
// 2. Associate with category
// 3. Set proficiency levels
// 4. Link to job roles

Example:
{
  _id: ObjectId,
  name: "React Developer Framework",
  domain: "web-development",
  level: "Intermediate",
  skills: [
    { name: "React", proficiencyLevel: "Advanced" },
    { name: "JavaScript", proficiencyLevel: "Intermediate" },
    { name: "Redux", proficiencyLevel: "Intermediate" }
  ],
  category: CategoryId,
  courses: [1, 2, 3] // Course IDs
}
```

### Step 5: Database Storage
```
Categories Table
├── Web Development
│   ├── Frontend Developer (React)
│   ├── Backend Developer (Node.js)
│   └── Full Stack Developer
├── Data Science
│   ├── Machine Learning Engineer
│   ├── Data Analyst
│   └── Data Scientist
└── ...

SkillFrameworks Table
├── React Developer Framework (web-dev)
├── Python Developer Framework (data-sci)
├── AWS Solutions Architect (cloud)
└── ...
```

---

## 🔑 Key Features of CSV Processing

### 1. Skill Parsing
```javascript
// Skills are parsed from semicolon-separated strings
Input:  "React;JavaScript;Redux;React Router;Hooks"
         ↓
Output: ["React", "JavaScript", "Redux", "React Router", "Hooks"]

// Handles various formats:
- With semicolons: "Python;Pandas;NumPy"
- With quotes: "'Python';'Pandas'"
- With brackets: "[Python,Pandas]"
```

### 2. Job Title Cleaning
```javascript
// Removes common prefixes/suffixes from domain field
Input:  "100% Remote | Senior React Developer | Full-Time"
         ↓
Process: Clean remote prefix, level prefix
         ↓
Output: "React Developer"
```

### 3. Category Generation
```javascript
// Automatically creates categories from domain
Input Domain:  "web-development"
               ↓
Generated Category Name: "Web Development"

// With styling/formatting applied
Display: "🌐 Web Development"
```

### 4. Duplicate Handling
```javascript
// Prevents duplicate skills within a framework
Input Skills: ["React", "React", "JavaScript", "React"]
              ↓
Output: ["React", "JavaScript"]  // Unique only
```

---

## 📥 How to Add New Courses

### Option 1: Using Dashboard Upload
```
1. Log in as Admin
2. Go to Dashboard → Upload CSV Data
3. Select your CSV file
4. Choose "Clear Existing" if needed
5. Click Upload
6. Wait for processing
7. View in Role-Skill Mapping
```

### Option 2: Programmatically
```javascript
// POST /api/admin/upload-csv
const formData = new FormData();
formData.append('csvFile', csvFile);
formData.append('clearExisting', false);

const response = await fetch('/api/admin/upload-csv', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📋 CSV Template

### Minimal Required Format
```csv
id,title,platform,url,skills,domain,difficulty,duration_hours,rating,reviews_count,price,instructor,description
1,Course Name,Platform,https://url.com,Skill1;Skill2;Skill3,domain,beginner,10,4.5,100,9.99,Instructor Name,Description here
```

### Full Template Example
```csv
id,title,platform,url,skills,domain,difficulty,duration_hours,rating,reviews_count,price,instructor,description
51,Your Course Title,Udemy,https://www.udemy.com/course/your-course,Python;Django;REST API,web-development,intermediate,40,4.6,5000,Your Name,Your course description
52,Another Course,Coursera,https://www.coursera.org/learn/course,AWS;Cloud;DevOps,cloud-computing,advanced,30,4.8,10000,Another Instructor,Another description
```

---

## ✅ Data Validation Rules

### Column Validation

| Column | Rules |
|--------|-------|
| **id** | Must be unique, positive integer |
| **title** | Required, 3-200 characters |
| **platform** | Required, recognized platform |
| **url** | Must be valid URL format |
| **skills** | Semicolon-separated, non-empty |
| **domain** | Must be recognized domain |
| **difficulty** | beginner, intermediate, or advanced |
| **duration_hours** | Positive integer |
| **rating** | Decimal 0-5 |
| **reviews_count** | Non-negative integer |
| **price** | Number (0 = free) |
| **instructor** | Required, 1-100 characters |
| **description** | Optional, max 500 characters |

---

## 🚨 Common Issues & Solutions

### Issue 1: Skills Not Parsing Correctly
```
Problem: Skills field has commas instead of semicolons
Input:   "React, JavaScript, Redux"
         ↓
Solution: Use semicolons
Corrected: "React;JavaScript;Redux"
```

### Issue 2: Domain Not Recognized
```
Problem: Domain field has typo
Input:   "webdevelopment" or "web dev"
         ↓
Solution: Use exact domain names
Corrected: "web-development"
```

### Issue 3: Duplicate Courses
```
Problem: Multiple rows with same title/id
         ↓
Solution: Ensure each course has unique ID
         Recommend: Delete old CSV and reimport
```

### Issue 4: Invalid URL Format
```
Problem: Missing http:// or https://
Input:   "www.udemy.com/course/..."
         ↓
Solution: Include protocol
Corrected: "https://www.udemy.com/course/..."
```

---

## 🔄 Current Data Summary

### Courses by Platform
```
📕 Udemy:    30 courses (includes technical depth)
🎓 Coursera:  15 courses (university-backed)
📺 YouTube:   5 courses (free resources)
```

### Courses by Domain
```
💻 Web Development:      12 courses
📊 Data Science:         11 courses
☁️  Cloud Computing:     7 courses
📱 Mobile Development:   3 courses
🔧 Software Engineering: 7 courses
🔐 Cybersecurity:        3 courses
🎮 Game Development:     2 courses
🎨 UI/UX Design:         4 courses
```

### Difficulty Distribution
```
🟢 Beginner:     18 courses (36%)
🟡 Intermediate: 27 courses (54%)
🔴 Advanced:     5 courses (10%)
```

### Total Skills Represented
```
~150+ unique skills across all domains
```

---

## 🔀 CSV Data Bifurcation

### **PART 1: RoleSkillMapping Component**

**Relevant CSV Columns**:
```
├─ domain          → Category creation
├─ skills          → Skill extraction & mapping
├─ title           → Job role naming
└─ platform        → Course platform reference
```

#### How RoleSkillMapping Uses CSV Data

**Step 1: Domain → Categories**
```csv
domain: "web-development"
         ↓
Creates:  Category { name: "Web Development" }
Display:  Shows in Advanced Tools preview
```

**Step 2: Skills → Skill Frameworks**
```csv
skills: "React;JavaScript;Redux;React Router;Hooks"
        ↓
Creates: SkillFramework {
  name: "React Developer Framework"
  skills: ["React", "JavaScript", "Redux", "React Router", "Hooks"]
  level: "Intermediate"
}
Display: Shows in frameworks table
```

**Step 3: Job Roles Creation**
```csv
domain: "web-development"
skills: "React;JavaScript;Redux;React Router;Hooks"
title:  "React - The Complete Guide"
        ↓
Creates: JobRole {
  name: "React Developer"
  category: "Web Development"
  requiredSkills: ["React", "JavaScript", "Redux", "React Router", "Hooks"]
}
Display: Shows in mapped roles section
```

#### RoleSkillMapping UI Displays

**Category Selection (from domain field)**
```
[Web Development]  [Data Science]  [Cloud Computing]  [Mobile Dev]
    ↑
  From CSV domain values
```

**Frameworks Table (generated from skills)**
```
Framework Name        | Domain    | Skills | Level
React Dev Framework   | Web Dev   |   5    | Intermediate
Python ML Framework   | Data Sci  |   3    | Advanced
AWS Framework        | Cloud     |   4    | Intermediate
```

**Mapped Roles (from skills & domain)**
```
Role: React Developer
Required Skills: [React] [JavaScript] [Redux] [React Router] [Hooks]

Role: Python Developer
Required Skills: [Python] [Pandas] [NumPy] [Matplotlib] [Scikit-Learn]
```

#### Statistics Calculated for RoleSkillMapping

From CSV data:
```
Total Roles = Count of unique domain-skill combinations
            = 50 rows processed → Multiple roles per domain

Total Skills = Sum of all skills across all rows
             = ~150+ unique skills

Active Mappings = Rows with non-empty skills field
                = 50 active mappings
```

#### Sample CSV Rows Used by RoleSkillMapping

```csv
1,React - The Complete Guide,Udemy,https://udemy.com/react,
React;JavaScript;Redux;React Router;Hooks,web-development,
beginner,48,4.7,180000,Maximilian Schwarzmuller,Description
   ↓
Creates:
  - Category: "Web Development"
  - JobRole: "React Developer"
  - Skills: [React, JavaScript, Redux, React Router, Hooks]

36,MongoDB Complete Guide,Udemy,https://udemy.com/mongodb,
MongoDB;NoSQL;Mongoose;Aggregation,web-development,
intermediate,18,4.7,55000,Maximilian Schwarzmuller,Description
   ↓
Creates:
  - Category: "Web Development"
  - JobRole: "MongoDB Developer"
  - Skills: [MongoDB, NoSQL, Mongoose, Aggregation]
```

---

### **PART 2: GapAnalysisConfig Component**

**Relevant CSV Columns**:
```
├─ difficulty       → Proficiency level thresholds
├─ duration_hours   → Learning time estimates
├─ rating           → Course quality metrics
├─ reviews_count    → Community validation
├─ price            → Cost analysis
└─ instructor       → Expertise level
```

#### How GapAnalysisConfig Uses CSV Data

**Step 1: Difficulty → Proficiency Thresholds**
```csv
difficulty: "beginner" / "intermediate" / "advanced"
            ↓
Maps to threshold levels:
  beginner      → 0-40% proficiency
  intermediate  → 40-75% proficiency
  advanced      → 75-100% proficiency

Sets Default Thresholds:
  minThreshold = 60%  (intermediate level baseline)
  maxThreshold = 100% (advanced level target)
```

**Step 2: Duration → Learning Path Estimates**
```csv
duration_hours: 48, 20, 10, etc.
                ↓
Used for:
  - Gap analysis timing
  - Learning path duration calculation
  - Workload estimation
  - Progress tracking

Statistics:
  Average duration = Sum of all hours / number of courses
  Helps set realistic learning goals
```

**Step 3: Rating & Reviews → Quality Metrics**
```csv
rating: 4.7
reviews_count: 180000
              ↓
Quality assessment:
  High rating (>4.5) = Excellent course
  High reviews (>100k) = Community validated
  
Used for:
  - Recommending high-quality resources
  - Filtering courses for gap closure
  - Ranking suggestions
```

**Step 4: Price → Cost Analysis**
```csv
price: 0, 9.99, 99.99
       ↓
Classification:
  0 = Free (YouTube, FreeCodeCamp)
  1-15 = Budget-friendly (promotional prices)
  16-99 = Standard price
  100+ = Premium courses

Gap analysis uses this to:
  - Balance cost when recommending
  - Suggest free alternatives if available
  - Include cost in recommendations
```

#### GapAnalysisConfig Configuration Uses

**Default Thresholds from Difficulty Distribution**
```
From CSV difficulty counts:
  18 beginner courses (36%)    → Beginner base = 40%
  27 intermediate (54%)        → Standard level = 60%
  5 advanced (10%)             → Advanced goal = 100%

Settings:
  minThreshold = 60% (intermediate foundation)
  maxThreshold = 100% (advanced mastery)
```

**Analysis Parameters**
```
Gap Weighting:
  Conservative: Focus on advanced courses (10% availability)
  Balanced: Mix of all levels (54% intermediate available)
  Aggressive: Includes beginner courses (36% available)

Analysis Mode:
  Quick Scan: Uses only difficulty & duration
  Comprehensive: Includes rating, reviews, cost
```

**Statistics Dashboard**
```
From CSV data calculations:

Average Gap = (50 - courses_matched) / 50 * 100
            = Skill gap percentage

Total Analyses = Number of times gap analysis was run
               = Stored in recommendations table

Recommendations = Courses selected based on thresholds
                = Filtered by rating (>4.5) & duration
```

#### Sample CSV Rows Used by GapAnalysisConfig

```csv
1,React - The Complete Guide,Udemy,https://udemy.com/react,
React;JavaScript;Redux;React Router;Hooks,web-development,
beginner,48,4.7,180000,Maximilian Schwarzmuller,Description
   ↓
Extracted for Gap Analysis:
  - Difficulty: "beginner" → 40% proficiency level
  - Duration: 48 hours → Learning time estimate
  - Rating: 4.7 → Quality score (high)
  - Reviews: 180000 → Popular course
  - Platform: Udemy → Paid, professional

6,AWS Certified Solutions Architect,Udemy,https://udemy.com/aws,
AWS;Cloud Computing;EC2;S3;VPC;IAM,cloud-computing,
intermediate,45,4.7,200000,Stephane Maarek,Description
   ↓
Extracted for Gap Analysis:
  - Difficulty: "intermediate" → 60% proficiency level (RECOMMENDED BASELINE)
  - Duration: 45 hours → Reasonable timeframe
  - Rating: 4.7 → Highly rated
  - Reviews: 200000 → Widely trusted
  - Cost: Professional training investment

11,TensorFlow Developer Certificate,Coursera,
https://coursera.org/tensorflow,TensorFlow;Deep Learning;
Computer Vision;NLP,data-science,advanced,80,4.8,60000,
Laurence Moroney,Description
   ↓
Extracted for Gap Analysis:
  - Difficulty: "advanced" → 100% proficiency level (GOAL)
  - Duration: 80 hours → Comprehensive learning
  - Rating: 4.8 → Excellent quality
  - Reviews: 60000 → Vetted by experts
  - Platform: Coursera → University-backed
```

#### Statistics Calculated for GapAnalysisConfig

From CSV data:
```
Total Analyses = 0 (increments on each gap analysis)

Average Gap = (Recommendation Count / Total Skills) * 100
            = Percentage of skills needing improvement

Recommendations = Courses matching threshold criteria
                = Filtered by: rating > 4.5, 
                              difficulty matches threshold,
                              cost within budget
```

#### Threshold Configuration from CSV

**Default Settings Derived from CSV**:
```
minThreshold = 60%
  └─ Intermediate level
     (54% of courses are intermediate)

maxThreshold = 100%
  └─ Advanced mastery
     (10% of courses are advanced)

gapWeighting = "balanced"
  └─ Uses all difficulty levels equally

analysisMode = "comprehensive"
  └─ Uses all CSV columns for analysis

includeRoadmap = true
  └─ Uses duration_hours for roadmap

autoRecommend = true
  └─ Uses rating & reviews for ranking
```

---

## 🔀 Data Flow Comparison

### RoleSkillMapping Data Flow
```
CSV Row
  ├─ domain
  │   └─→ Category Creation
  │       └─ Name: Formatted domain
  │       └─ Display: Category buttons
  │
  ├─ skills (semicolon-separated)
  │   └─→ Skill Extraction
  │       ├─ Parse into array
  │       └─ Remove duplicates
  │
  └─→ JobRole Creation
      ├─ Name: Derived from domain/skills
      ├─ RequiredSkills: From skills array
      └─ Display: In mapped roles section
```

### GapAnalysisConfig Data Flow
```
CSV Row
  ├─ difficulty
  │   └─→ Proficiency Level
  │       ├─ beginner → 40%
  │       ├─ intermediate → 60%
  │       └─ advanced → 100%
  │
  ├─ duration_hours
  │   └─→ Learning Time Estimate
  │       └─ Used in roadmap generation
  │
  ├─ rating
  │   └─→ Quality Filter
  │       └─ Recommend if > 4.5
  │
  ├─ reviews_count
  │   └─→ Community Validation
  │       └─ Weight in recommendations
  │
  └─→ Recommendation Algorithm
      ├─ Filter by threshold
      ├─ Sort by quality
      └─ Display: In recommendations
```

---

## 📊 Complete CSV Column Usage Map

| CSV Column | RoleSkillMapping | GapAnalysisConfig |
|------------|------------------|-------------------|
| **id** | Course reference | Internal tracking |
| **title** | Job role naming | Course display |
| **platform** | Framework metadata | Recommendation filter |
| **url** | Link in mappings | Course link |
| **skills** | ✅ PRIMARY | Secondary (for categorization) |
| **domain** | ✅ PRIMARY | Secondary (for organization) |
| **difficulty** | ⚠️ Secondary | ✅ PRIMARY |
| **duration_hours** | ⚠️ Secondary | ✅ PRIMARY |
| **rating** | ⚠️ Secondary | ✅ PRIMARY |
| **reviews_count** | ⚠️ Secondary | ✅ PRIMARY |
| **price** | ⚠️ Secondary | ✅ PRIMARY |
| **instructor** | ⚠️ Secondary | ⚠️ Secondary |
| **description** | Reference | Display |

---

## 🎯 Quick Reference: Where CSV Data Goes

### For RoleSkillMapping Users
```
"I want to see job roles and their skills"
   ↓
CSV columns used: domain, skills, title
   ↓
Example output:
  Category: Web Development
  Role: React Developer
  Skills: [React, JavaScript, Redux, React Router, Hooks]
```

### For GapAnalysisConfig Users
```
"I want to configure skill gap thresholds"
   ↓
CSV columns used: difficulty, duration_hours, rating, reviews_count, price
   ↓
Example output:
  Min Threshold: 60% (based on intermediate difficulty)
  Max Threshold: 100% (based on advanced difficulty)
  Recommended courses: Top-rated, reasonable duration
```

---

## 💡 Best Practices

### When Creating CSV Files

✅ **DO**:
- Use semicolons to separate skills
- Use exact domain names from supported list
- Include valid URLs with http:// or https://
- Ensure unique IDs for each row
- Keep titles descriptive but concise
- Use consistent difficulty levels
- Format: valid CSV with proper escaping

❌ **DON'T**:
- Use commas in skills field
- Create custom domain names
- Leave URL field empty
- Duplicate course IDs
- Use abbreviations in titles
- Mix difficulty naming conventions
- Include special characters without escaping

---

## 📊 Sample Processing Flow

### Input CSV (2 rows)
```csv
id,title,platform,url,skills,domain,difficulty,duration_hours,rating,reviews_count,price,instructor,description
1,React Advanced,Udemy,https://udemy.com/react,React;TypeScript;Redux,web-development,advanced,50,4.8,200000,John Doe,Advanced React patterns
2,Python Basics,YouTube,https://youtube.com/python,Python;Programming,data-science,beginner,5,4.9,1000000,Jane Smith,Learn Python from scratch
```

### Processing Steps
```
1. Parse CSV headers
   ↓
2. Extract domain: "web-development" → Create category "Web Development"
   ↓
3. Parse skills: "React;TypeScript;Redux" → [React, TypeScript, Redux]
   ↓
4. Generate SkillFramework for React
   ↓
5. Create JobRole "React Developer"
   ↓
6. Repeat for Python row
   ↓
7. Save to MongoDB
   ↓
8. Return success response with counts
```

### Output
```json
{
  "message": "CSV processed successfully",
  "categoriesCreated": 2,
  "frameworksGenerated": 2,
  "skillsExtracted": 5,
  "coursesProcessed": 2,
  "categories": [
    "Web Development",
    "Data Science"
  ]
}
```

---

## 🔗 Integration Points

### Where CSV Data Is Used

1. **RoleSkillMapping Component**
   - Displays categories from CSV
   - Shows frameworks generated from skills
   - Lists job roles extracted from domain

2. **Dashboard Statistics**
   - Total Roles (from CSV domains)
   - Total Skills (from skills field)
   - Active Mappings (frameworks created)

3. **Recommendations Engine**
   - Suggests courses based on skills
   - Uses course duration and rating
   - Filters by difficulty level

4. **User Skill Assessment**
   - Compares user skills with CSV data
   - Generates gap analysis
   - Recommends learning paths

---

## 📈 Data Model

### How CSV Maps to Database Models

```
CSV Row
  │
  ├─ Category Document
  │   ├─ name: (from domain)
  │   ├─ jobRoles: []
  │   └─ displayName: (formatted)
  │
  ├─ SkillFramework Document
  │   ├─ name: (derived from skills)
  │   ├─ domain: (from CSV domain)
  │   ├─ skills: [array]
  │   ├─ level: (from difficulty)
  │   └─ category: (reference)
  │
  └─ Course Reference
      ├─ id: (from CSV id)
      ├─ title: (from CSV title)
      ├─ platform: (from CSV platform)
      └─ url: (from CSV url)
```

---

## 🎯 Future Enhancements

Potential improvements for CSV processing:

- [ ] Support for multi-level skills hierarchy
- [ ] Course prerequisite mapping
- [ ] Skill proficiency level assignment from CSV
- [ ] Automatic skill difficulty inference
- [ ] Batch course scheduling
- [ ] Multi-language support
- [ ] CSV export functionality
- [ ] CSV validation preview before upload
- [ ] Incremental updates (add without clearing)
- [ ] Skill alias mapping (React.js → React)

---

## 📞 Support

### CSV Upload Issues?

1. **Check**: Column headers match exactly
2. **Verify**: All required fields are populated
3. **Validate**: Skill field uses semicolons (;) not commas
4. **Ensure**: Domain is from supported list
5. **Confirm**: No duplicate IDs

### Still having issues?
- Check browser console for error messages
- Review backend logs for processing errors
- Ensure CSV file encoding is UTF-8
- Try with smaller subset of data first

---

## 📚 Related Documentation

- [DASHBOARD_ACCESS_GUIDE.md](DASHBOARD_ACCESS_GUIDE.md) - How to upload CSV
- [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) - API endpoint details
- [DASHBOARD_FEATURES.md](DASHBOARD_FEATURES.md) - Feature overview
- [backend/routes/admin.js](backend/routes/admin.js) - CSV processing code

---

**CSV Format Version**: 1.0  
**Last Updated**: January 18, 2026  
**Status**: ✅ Ready for Use
