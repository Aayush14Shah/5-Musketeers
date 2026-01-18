# Visual Architecture & Component Map

## Component Hierarchy

```
AdminDashboard (Main Container)
├── AdminLayout (Sidebar + Navigation)
└── Renderer
    ├── Dashboard (when activeTab === 'dashboard')
    │   ├── Stats Grid
    │   │   ├── StatCard (Categories)
    │   │   ├── StatCard (Frameworks)
    │   │   ├── StatCard (Job Roles)
    │   │   └── StatCard (System Health)
    │   ├── Quick Actions
    │   │   ├── Upload CSV Button
    │   │   ├── View Frameworks Button
    │   │   └── Configure Analysis Button
    │   ├── Advanced Tools ✨ NEW
    │   │   ├── RoleSkillMapping Preview Card
    │   │   │   ├── Statistics Mini
    │   │   │   ├── Category Preview
    │   │   │   └── Explore Button → Tab Switch
    │   │   └── GapAnalysisConfig Preview Card
    │   │       ├── Config Mini Display
    │   │       ├── Status Indicators
    │   │       └── Configure Button → Tab Switch
    │   └── Recent Activity
    │
    ├── RoleSkillMapping (when activeTab === 'role-skill-mapping') ✨ NEW
    │   ├── Header
    │   ├── Statistics Section
    │   │   ├── StatItem (Total Roles)
    │   │   ├── StatItem (Total Skills)
    │   │   └── StatItem (Active Mappings)
    │   ├── Category Selection
    │   │   └── Category Buttons (Grid)
    │   ├── Frameworks Table
    │   │   ├── Table Header
    │   │   └── Table Body
    │   │       ├── Framework Row
    │   │       ├── Domain Info
    │   │       ├── Skills Count Badge
    │   │       ├── Level
    │   │       └── Status
    │   └── Mapped Roles Section
    │       └── Role Cards
    │           ├── Role Name
    │           ├── Skills Count
    │           └── Skill Badges
    │
    ├── GapAnalysisConfig (when activeTab === 'gap-analysis-config') ✨ NEW
    │   ├── Header
    │   ├── Statistics Section
    │   │   ├── StatBox (Total Analyses)
    │   │   ├── StatBox (Average Gap)
    │   │   └── StatBox (Recommendations)
    │   ├── Success Notification (conditional)
    │   ├── ConfigCard: Thresholds
    │   │   ├── Min Threshold Slider
    │   │   └── Max Threshold Slider
    │   ├── ConfigCard: Analysis Configuration
    │   │   ├── Gap Weighting Selector
    │   │   └── Analysis Mode Selector
    │   ├── ConfigCard: Feature Settings
    │   │   ├── Learning Roadmap Toggle
    │   │   └── Auto Recommendations Toggle
    │   ├── ConfigCard: History (conditional)
    │   │   └── History Items
    │   └── Action Buttons
    │       ├── Save Configuration
    │       └── Reset to Default
    │
    └── (Other existing tabs...)
        ├── JobRoleManagement
        ├── SkillFramework
        └── Recommendations
```

---

## Data Flow Diagram

### RoleSkillMapping Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Component Mount                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │  loadCategories()        │
         │                          │
         │  API Call:               │
         │  GET /admin/categories   │
         └────────┬─────────────────┘
                  │
                  ▼
        ┌──────────────────────┐
        │ Response: Categories │
        │ with jobRoles        │
        └────────┬─────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌──────────────────┐  ┌─────────────────┐
│ setCategories()  │  │ calculateStats()│
│                  │  │                 │
│ Store in state   │  │ Compute:        │
│                  │  │ - totalRoles    │
│ + Set first      │  │ - totalSkills   │
│   category       │  │ - mappings      │
└────────┬─────────┘  └────────┬────────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
     ┌──────────────────────────┐
     │ loadFrameworks()         │
     │                          │
     │ API Call:                │
     │ GET /admin/frameworks    │
     │ ?category={categoryId}   │
     └────────┬─────────────────┘
              │
              ▼
     ┌──────────────────────────┐
     │ Response: Frameworks     │
     │ for selected category    │
     └────────┬─────────────────┘
              │
              ▼
     ┌──────────────────────────┐
     │ setFrameworks()          │
     │                          │
     │ Store in state           │
     └────────┬─────────────────┘
              │
              ▼
     ┌──────────────────────────┐
     │    Render UI with:       │
     │ - Stats cards            │
     │ - Category buttons       │
     │ - Framework table        │
     │ - Role details           │
     └──────────────────────────┘

User Interaction:
     │
     ▼
┌──────────────────────────┐
│ User selects category    │
│ (handleCategoryChange)   │
└────────┬─────────────────┘
         │
         └──→ loadFrameworks() [LOOP]
```

### GapAnalysisConfig Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Component Mount                        │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌─────────────────────┐  ┌──────────────────────┐
│ loadConfiguration() │  │ loadStats()          │
│                     │  │                      │
│ Read from:          │  │ API Call:            │
│ localStorage        │  │ GET /recommendations │
│ "gapAnalysisConfig" │  │ /stats               │
└────────┬────────────┘  └──────────┬───────────┘
         │                          │
         ▼                          ▼
   ┌──────────────┐         ┌───────────────┐
   │ Saved config │         │ Stats response│
   │ or defaults  │         │               │
   └────────┬─────┘         └────────┬──────┘
            │                        │
            ▼                        ▼
      ┌──────────────┐        ┌──────────────┐
      │ setConfig()  │        │ setStats()   │
      │              │        │              │
      │ Store in     │        │ Store in     │
      │ state        │        │ state        │
      └────────┬─────┘        └──────┬───────┘
               │                     │
               └──────────┬──────────┘
                          │
            ┌─────────────┴────────────┐
            │                          │
            ▼                          ▼
       ┌──────────────┐        ┌──────────────┐
       │ loadConfig   │        │  Render UI   │
       │ History()    │        │  with:       │
       │              │        │ - Stats      │
       │ Read:        │        │ - Sliders    │
       │ localStorage │        │ - Toggles    │
       │ "configHist"│        │ - History    │
       └────────┬─────┘        └──────────────┘
                │
                ▼
          ┌──────────────┐
          │ setConfigHist│
          │ ory()        │
          └──────────────┘

User Interaction:
     │
     ├──→ Adjust Slider
     │    └──→ handleConfigChange() → Mark unsaved
     │
     ├──→ Select Option
     │    └──→ handleConfigChange() → Mark unsaved
     │
     ├──→ Toggle Feature
     │    └──→ handleConfigChange() → Mark unsaved
     │
     ├──→ Click Save
     │    └──→ saveConfiguration()
     │         ├─ localStorage.setItem()
     │         ├─ Add to history
     │         ├─ Keep max 10 entries
     │         ├─ localStorage.setItem() history
     │         ├─ setSaved(true)
     │         └─ Auto-hide after 3s
     │
     └──→ Click Reset
          └──→ resetConfiguration()
               ├─ Load defaults
               └─ Mark unsaved
```

---

## Dashboard Preview Integration

```
┌───────────────────────────────────────────────────────┐
│                    DASHBOARD                          │
├───────────────────────────────────────────────────────┤
│                                                       │
│  Stats Grid (4 columns)                              │
│  ┌─────────┬─────────┬─────────┬─────────┐           │
│  │Categories│Frameworks│JobRoles│Health  │           │
│  └─────────┴─────────┴─────────┴─────────┘           │
│                                                       │
│  Quick Actions (3 columns)                           │
│  ┌──────────┬──────────┬──────────┐                  │
│  │Upload CSV│Frameworks│Configure │                  │
│  └──────────┴──────────┴──────────┘                  │
│                                                       │
│  ┌─ ADVANCED TOOLS (NEW) ─────────────────┐         │
│  │                                         │         │
│  │  Role-Skill Mapping | Gap Analysis     │         │
│  │  ┌──────────────────┬─────────────┐    │         │
│  │  │                  │             │    │         │
│  │  │ 🔗               │ ⚙️          │    │         │
│  │  │                  │             │    │         │
│  │  │ Total Roles: 12  │ Min: 60%    │    │         │
│  │  │ Mapped: 34       │ Max: 100%   │    │         │
│  │  │                  │             │    │         │
│  │  │ [Explore]        │ [Configure] │    │         │
│  │  │                  │             │    │         │
│  │  └──────────────────┴─────────────┘    │         │
│  │                                         │         │
│  └─────────────────────────────────────────┘         │
│                                                       │
│  Recent Activity                                      │
│  ┌───────────────────────────────────────┐           │
│  │ Activity Log Items                    │           │
│  └───────────────────────────────────────┘           │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## Feature Pages Layout

### RoleSkillMapping Page

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Header                                              │
│  Role-Skill Mapping                                  │
│  Manage and visualize relationships...               │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Stats Grid (3 columns)                              │
│  ┌──────────────┬──────────────┬──────────────┐     │
│  │ Total Roles  │ Total Skills │Active Mapping│     │
│  │    12 👔     │     34 🎯    │     8 🔗     │     │
│  └──────────────┴──────────────┴──────────────┘     │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Category Selection                                   │
│  ┌──────────┬──────────┬──────────┬──────────┐      │
│  │Category 1│Category 2│Category 3│Category 4│      │
│  │ 3 roles  │ 4 roles  │ 2 roles  │ 3 roles  │      │
│  └──────────┴──────────┴──────────┴──────────┘      │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Skill Frameworks Table                              │
│  ┌────────────┬────────┬──────┬──────┬────────┐    │
│  │Framework   │Domain  │Skills│Level │Status  │    │
│  ├────────────┼────────┼──────┼──────┼────────┤    │
│  │Framework 1 │IT      │  12  │Inter │Active  │    │
│  │Framework 2 │IT      │  15  │Adv   │Active  │    │
│  │Framework 3 │Finance │  10  │Inter │Active  │    │
│  └────────────┴────────┴──────┴──────┴────────┘    │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Mapped Roles                                         │
│  ┌─────────────────────────────────────┐            │
│  │ Role Name: Frontend Developer       │            │
│  │ Required Skills: 4                  │            │
│  │ [React] [JavaScript] [CSS] [HTML]   │            │
│  └─────────────────────────────────────┘            │
│  ┌─────────────────────────────────────┐            │
│  │ Role Name: Backend Developer        │            │
│  │ Required Skills: 4                  │            │
│  │ [Node.js] [MongoDB] [APIs] [Docker] │            │
│  └─────────────────────────────────────┘            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### GapAnalysisConfig Page

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Header                                              │
│  Gap Analysis Configuration                          │
│  Configure parameters and thresholds...              │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Stats Grid (3 columns)                              │
│  ┌──────────────┬──────────────┬──────────────┐     │
│  │Total Analyses│ Average Gap  │Recommendations│    │
│  │     42 📊    │   35.5% 📈   │     128 💡    │    │
│  └──────────────┴──────────────┴──────────────┘     │
│                                                      │
├──────────────────────────────────────────────────────┤
│  ✅ Saved Notification (conditional)                 │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Skill Gap Thresholds                                │
│  ┌──────────────────────────────────────┐           │
│  │ Minimum Threshold: 60%               │           │
│  │ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │           │
│  │ Skills below this level are flagged  │           │
│  │                                      │           │
│  │ Maximum Threshold: 100%              │           │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │           │
│  │ Target proficiency level             │           │
│  └──────────────────────────────────────┘           │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Analysis Configuration                              │
│  ┌──────────────────────────────────────┐           │
│  │ Gap Weighting                        │           │
│  │ ┌──────────┬─────────┬──────────┐   │           │
│  │ │🔒        │⚖️       │🚀        │   │           │
│  │ │Conservative│Balanced│Aggressive│  │           │
│  │ └──────────┴─────────┴──────────┘   │           │
│  │                                      │           │
│  │ Analysis Mode                        │           │
│  │ ┌─────────────┬──────────────────┐  │           │
│  │ │ Quick Scan  │ Comprehensive ✓  │  │           │
│  │ └─────────────┴──────────────────┘  │           │
│  └──────────────────────────────────────┘           │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Feature Settings                                    │
│  ┌──────────────────────────────────────┐           │
│  │ ☑ Include Learning Roadmap          │           │
│  │   Generate personalized paths        │           │
│  │ ☑ Auto-Generate Recommendations     │           │
│  │   Suggest courses and resources      │           │
│  └──────────────────────────────────────┘           │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Configuration History                               │
│  ┌──────────────────────────────────────┐           │
│  │ 2024-01-18 10:30 | Min: 60% Max: 100%           │
│  │ 2024-01-18 09:15 | Min: 50% Max: 95% │           │
│  │ 2024-01-17 14:00 | Min: 70% Max: 100%│          │
│  └──────────────────────────────────────┘           │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Action Buttons                                      │
│  ┌──────────────────┬──────────────────┐            │
│  │  💾 Save Config  │ ↺ Reset to Default           │
│  └──────────────────┴──────────────────┘            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## API Endpoint Summary

```
RoleSkillMapping Endpoints:
├── GET /admin/categories
│   Response: [{_id, name, jobRoles: [{name, requiredSkills}]}]
│
└── GET /admin/frameworks?category={categoryId}
    Response: [{_id, name, domain, level, skills: [{name, level}]}]

GapAnalysisConfig Endpoints:
└── GET /recommendations/stats
    Response: {totalAnalyses, averageGap, recommendations}

LocalStorage Keys:
├── gapAnalysisConfig
│   Value: {minThreshold, maxThreshold, gapWeighting, analysisMode, includeRoadmap, autoRecommend}
│
└── configHistory
    Value: [{timestamp, config}] (max 10 entries)
```

---

## State Management Overview

```
RoleSkillMapping Component State:
├── categories: Category[] - All categories
├── selectedCategory: string - Selected category ID
├── frameworks: Framework[] - Frameworks for selected category
├── loading: boolean - Loading state
└── stats: {totalRoles, totalSkills, mappings}

GapAnalysisConfig Component State:
├── config: Configuration object
│   ├── minThreshold: number (0-100)
│   ├── maxThreshold: number (0-100)
│   ├── gapWeighting: 'conservative' | 'balanced' | 'aggressive'
│   ├── analysisMode: 'quick' | 'comprehensive'
│   ├── includeRoadmap: boolean
│   └── autoRecommend: boolean
├── stats: {totalAnalyses, averageGap, recommendationsGenerated}
├── configHistory: {timestamp, config}[]
├── saved: boolean - Show success notification
└── loading: boolean - Show loading state
```

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Files Modified | 3 |
| Components Enhanced | 2 |
| New UI Sections | 1 |
| Lines Added | 544+ |
| Features Added | 12+ |
| API Endpoints Used | 3 |
| LocalStorage Keys Used | 2 |
| Configuration Options | 6 |
| History Entries (max) | 10 |
| Responsive Breakpoints | 3 |
| Visual Sections | 15+ |

