# API Integration & Data Flow

## Overview
This document details how RoleSkillMapping and GapAnalysisConfig components interact with the backend APIs and manage data.

---

## 1. Role-Skill Mapping - Data Flow

### Component Hierarchy
```
Dashboard
  ├─ Preview Card
  │   ├─ Total Roles (calculated)
  │   ├─ Mapped Skills (calculated)
  │   └─ Button → RoleSkillMapping Page
  │
└─ RoleSkillMapping Page
    ├─ Categories
    ├─ Selected Category
    ├─ Frameworks
    ├─ Statistics
    └─ Role Details
```

### API Calls

#### 1.1 Load Categories
```javascript
// Called on component mount
const loadCategories = async () => {
  const response = await adminAPI.getCategories();
  // Returns: Array of category objects
  // Each category has:
  // - _id: unique identifier
  // - name: category name (e.g., "IT", "Healthcare")
  // - jobRoles: array of role objects
  //   - Each role has:
  //     - name: role name (e.g., "Software Engineer")
  //     - requiredSkills: array of skill names
}
```

**Endpoint**: `GET /admin/categories`
**Headers**: Bearer token (auto-added by interceptor)
**Response**:
```json
[
  {
    "_id": "category-123",
    "name": "Information Technology",
    "jobRoles": [
      {
        "name": "Frontend Developer",
        "requiredSkills": ["React", "JavaScript", "CSS", "HTML"]
      },
      {
        "name": "Backend Developer",
        "requiredSkills": ["Node.js", "MongoDB", "REST APIs", "Docker"]
      }
    ]
  }
]
```

#### 1.2 Load Frameworks for Category
```javascript
// Called when category is selected
const loadFrameworksForCategory = async (categoryId) => {
  const response = await frameworkAPI.getFrameworks({ 
    category: categoryId 
  });
  // Returns: Array of framework objects for selected category
}
```

**Endpoint**: `GET /admin/frameworks?category={categoryId}`
**Query Parameters**: `category` (category ID)
**Response**:
```json
[
  {
    "_id": "framework-456",
    "name": "React Developer Framework",
    "domain": "Frontend Development",
    "level": "Intermediate",
    "skills": [
      {
        "name": "React",
        "proficiencyLevel": "Advanced"
      },
      {
        "name": "JavaScript",
        "proficiencyLevel": "Intermediate"
      }
    ]
  }
]
```

#### 1.3 Calculate Statistics
```javascript
// Calculated from loaded categories (no API call)
const calculateStats = (categories) => {
  let totalRoles = 0;
  let totalSkills = 0;
  let mappings = 0;

  categories.forEach(cat => {
    // Count total roles
    totalRoles += cat.jobRoles?.length || 0;
    
    // Count total skills and mappings
    cat.jobRoles?.forEach(role => {
      totalSkills += role.requiredSkills?.length || 0;
      if (role.requiredSkills?.length > 0) {
        mappings += 1; // Count roles with mapped skills
      }
    });
  });

  return { totalRoles, totalSkills, mappings };
}
```

### State Management

```javascript
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(null);
const [frameworks, setFrameworks] = useState([]);
const [loading, setLoading] = useState(false);
const [stats, setStats] = useState({ 
  totalRoles: 0, 
  totalSkills: 0, 
  mappings: 0 
});
```

### UI Rendering Flow

```
1. Component Mount
   ↓
2. Load Categories (API call)
   ↓
3. Set first category as selected
   ↓
4. Load Frameworks for selected category (API call)
   ↓
5. Calculate Statistics (no API)
   ↓
6. Render UI with data
   ↓
7. User selects different category
   ↓
8. Load Frameworks for new category (API call)
   ↓
9. Update UI
```

### Error Handling

```javascript
try {
  const response = await adminAPI.getCategories();
  setCategories(response.data || []);
  // ... process data
} catch (error) {
  console.error('Error loading categories:', error);
  // Fallback: empty state shown
}
```

---

## 2. Gap Analysis Configuration - Data Flow

### Component Hierarchy
```
Dashboard
  ├─ Preview Card
  │   ├─ Min/Max Thresholds
  │   ├─ Settings Status
  │   └─ Button → GapAnalysisConfig Page
  │
└─ GapAnalysisConfig Page
    ├─ Statistics
    ├─ Configuration
    ├─ History
    └─ Save/Reset
```

### Data Sources

#### 2.1 Load Configuration from LocalStorage
```javascript
const loadConfiguration = () => {
  // Try to load from localStorage
  const savedConfig = localStorage.getItem('gapAnalysisConfig');
  if (savedConfig) {
    setConfig(JSON.parse(savedConfig));
  } else {
    // Use default if not found
    setConfig({
      minThreshold: 60,
      maxThreshold: 100,
      gapWeighting: 'balanced',
      analysisMode: 'comprehensive',
      includeRoadmap: true,
      autoRecommend: true,
    });
  }
}
```

**Storage Key**: `gapAnalysisConfig`
**Storage Type**: Browser LocalStorage
**Persistence**: Until manually cleared

#### 2.2 Load Statistics from API
```javascript
const loadStats = async () => {
  try {
    const response = await recommendationAPI.getStats();
    if (response.data) {
      setStats({
        totalAnalyses: response.data.totalAnalyses || 0,
        averageGap: response.data.averageGap || 0,
        recommendationsGenerated: response.data.recommendations || 0,
      });
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}
```

**Endpoint**: `GET /recommendations/stats`
**Response**:
```json
{
  "totalAnalyses": 42,
  "averageGap": 35.5,
  "recommendations": 128
}
```

#### 2.3 Load Configuration History from LocalStorage
```javascript
const loadConfigHistory = () => {
  const history = localStorage.getItem('configHistory');
  if (history) {
    setConfigHistory(JSON.parse(history));
  }
}
```

**Storage Key**: `configHistory`
**Storage Format**:
```json
[
  {
    "timestamp": "2024-01-18T10:30:00.000Z",
    "config": {
      "minThreshold": 60,
      "maxThreshold": 100,
      "gapWeighting": "balanced",
      "analysisMode": "comprehensive",
      "includeRoadmap": true,
      "autoRecommend": true
    }
  }
]
```

**History Limit**: Maximum 10 entries (FIFO - oldest removed)

### Save Configuration

```javascript
const saveConfiguration = () => {
  setLoading(true);
  setTimeout(() => {
    // Save current config to localStorage
    localStorage.setItem('gapAnalysisConfig', JSON.stringify(config));
    
    // Add to history
    const newHistory = [
      ...configHistory,
      {
        timestamp: new Date().toISOString(),
        config: { ...config }
      }
    ];
    
    // Keep only last 10 entries
    if (newHistory.length > 10) {
      newHistory.shift();
    }
    
    // Save history
    setConfigHistory(newHistory);
    localStorage.setItem('configHistory', JSON.stringify(newHistory));
    
    // Show success notification
    setSaved(true);
    setLoading(false);
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  }, 500);
}
```

### Configuration Change Handler

```javascript
const handleConfigChange = (field, value) => {
  setConfig(prev => ({ ...prev, [field]: value }));
  setSaved(false); // Mark as unsaved
}
```

### Reset Configuration

```javascript
const resetConfiguration = () => {
  const defaultConfig = {
    minThreshold: 60,
    maxThreshold: 100,
    gapWeighting: 'balanced',
    analysisMode: 'comprehensive',
    includeRoadmap: true,
    autoRecommend: true,
  };
  setConfig(defaultConfig);
  setSaved(false);
  // Note: Does not save until user clicks save
}
```

### State Management

```javascript
const [config, setConfig] = useState({
  minThreshold: 60,
  maxThreshold: 100,
  gapWeighting: 'balanced',
  analysisMode: 'comprehensive',
  includeRoadmap: true,
  autoRecommend: true,
});

const [stats, setStats] = useState({
  totalAnalyses: 0,
  averageGap: 0,
  recommendationsGenerated: 0,
});

const [configHistory, setConfigHistory] = useState([]);
const [saved, setSaved] = useState(false);
const [loading, setLoading] = useState(false);
```

### Data Flow

```
1. Component Mount
   ├─ Load Configuration (LocalStorage)
   ├─ Load Statistics (API)
   └─ Load History (LocalStorage)
   ↓
2. Render UI with loaded data
   ↓
3. User adjusts thresholds
   ↓
4. Update state (handleConfigChange)
   ↓
5. Mark as unsaved
   ↓
6. User clicks Save
   ├─ Save to LocalStorage
   ├─ Add to History
   ├─ Show notification
   └─ Auto-hide after 3s
   ↓
7. Continue with next changes
```

---

## 3. Dashboard Integration

### Preview Card Calculations

#### Role-Skill Mapping Card
```javascript
// Total Roles
categories.reduce((acc, cat) => acc + (cat.jobRoles?.length || 0), 0)

// Mapped Skills
categories.reduce((acc, cat) => {
  return acc + (cat.jobRoles?.reduce((roleAcc, role) => 
    roleAcc + (role.requiredSkills?.length || 0), 0) || 0);
}, 0)
```

#### Gap Analysis Config Card
```javascript
// Displays current configuration values from localStorage
// Min/Max thresholds
// Feature toggles status
// Shows hardcoded defaults in preview if no config saved
```

---

## 4. API Authentication

### Token Management
```javascript
// Token is added automatically by axios interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error Handling
```javascript
// If 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 5. Data Synchronization

### Real-time Updates
- **RoleSkillMapping**: Fetches fresh data on category change
- **GapAnalysisConfig**: Loads stats on mount, uses localStorage for config

### Cache Strategy
- **RoleSkillMapping**: No caching (always fetch latest)
- **GapAnalysisConfig**: Cache in localStorage (user can save)
- **History**: Keep last 10 entries in localStorage

### Refresh Triggers
- Component mount
- Category selection change
- Manual save action
- Page reload

---

## 6. Configuration Fields Explained

### minThreshold (0-100)
- **Purpose**: Minimum proficiency level below which skills are flagged as gaps
- **Default**: 60%
- **Use Case**: Skill proficiency baseline

### maxThreshold (0-100)
- **Purpose**: Target proficiency level for skill development
- **Default**: 100%
- **Use Case**: Learning goal target

### gapWeighting
- **Values**: 'conservative' | 'balanced' | 'aggressive'
- **Purpose**: Affects how strictly gaps are detected
- **Default**: 'balanced'

### analysisMode
- **Values**: 'quick' | 'comprehensive'
- **Purpose**: Analysis depth/speed tradeoff
- **Default**: 'comprehensive'

### includeRoadmap
- **Values**: true | false
- **Purpose**: Generate learning paths
- **Default**: true

### autoRecommend
- **Values**: true | false
- **Purpose**: Auto-generate course recommendations
- **Default**: true

---

## 7. Error Scenarios

### RoleSkillMapping Errors
```javascript
// API call fails
catch (error) {
  console.error('Error loading categories:', error);
  // UI shows empty state
  // User can retry by refreshing
}
```

### GapAnalysisConfig Errors
```javascript
// Stats API fails (non-critical)
catch (error) {
  console.error('Error loading stats:', error);
  // Stats show 0 values
  // Configuration still works
}

// LocalStorage fails (critical)
try {
  localStorage.setItem('key', value);
} catch (error) {
  // Notify user
  // Configuration not saved
}
```

---

## 8. Optimization Notes

- **Lazy Loading**: Frameworks loaded only when category selected
- **Calculation Efficiency**: Stats computed client-side (no API)
- **Storage Efficient**: History limited to 10 entries
- **Async Operations**: Non-blocking API calls with proper loading states
- **Error Recovery**: Graceful fallbacks for API failures
