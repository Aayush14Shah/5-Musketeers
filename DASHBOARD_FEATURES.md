# Dashboard Features - RoleSkillMapping & GapAnalysisConfig

## Overview
The admin dashboard has been enhanced with two powerful features: **Role-Skill Mapping** and **Gap Analysis Configuration**. These are now integrated into the main dashboard with preview cards and full dedicated pages.

---

## 1. Role-Skill Mapping Features

### Dashboard Preview Card
Located in the "Advanced Tools" section, displays:
- **Total Job Roles** - Count of all mapped job roles across categories
- **Mapped Skills** - Total number of skills mapped to roles
- Quick category preview (showing first 2 categories)
- "Explore Mappings" button to access full page

### Full Page Features (`/admin/role-skill-mapping`)

#### Statistics Section
- **Total Job Roles** - All available job roles in the system
- **Total Skills** - Complete skill inventory
- **Active Mappings** - Number of role-skill relationships established

#### Category Selection
- Interactive category selector showing:
  - Category name
  - Number of roles per category
  - Visual highlight for selected category
- Real-time framework loading based on category

#### Skill Frameworks Table
Displays comprehensive framework information:
- Framework Name
- Domain/Category
- Skills Count (badge display)
- Proficiency Level
- Active Status indicator

#### Mapped Roles Section
Shows detailed role information:
- Role name
- Required skills count
- Complete list of required skills as badges
- Organized by selected category
- Empty state handling for categories without mappings

### Data Management
- Automatic category and framework loading
- Real-time statistics calculation
- Responsive grid layouts
- Loading states with animated spinners

---

## 2. Gap Analysis Configuration Features

### Dashboard Preview Card
Located in the "Advanced Tools" section, displays:
- **Min Threshold** - Current minimum proficiency threshold (default: 60%)
- **Max Threshold** - Current maximum proficiency threshold (default: 100%)
- Status indicators for:
  - Analysis Mode (Comprehensive)
  - Learning Roadmap (Enabled)
  - Auto Recommendations (Active)
- "Configure Settings" button to access full page

### Full Page Features (`/admin/gap-analysis-config`)

#### Statistics Dashboard
- **Total Analyses** - Number of gap analysis performed
- **Average Gap** - Average skill gap percentage
- **Recommendations Generated** - Total recommendations created

#### Threshold Configuration
- **Minimum Threshold Slider** (0-100%)
  - Sets proficiency level below which skills are flagged as gaps
  - Real-time value display
  - Descriptive help text
  
- **Maximum Threshold Slider** (0-100%)
  - Sets target proficiency level for skill development
  - Real-time value display
  - Descriptive help text

#### Analysis Mode Configuration
- **Gap Weighting Options:**
  - 🔒 Conservative - Stricter gap detection
  - ⚖️ Balanced (Default) - Standard detection
  - 🚀 Aggressive - Broader detection
  
- **Analysis Mode Selection:**
  - Quick Scan - Fast analysis
  - Comprehensive - Detailed analysis (Default)

#### Feature Settings
- **Include Learning Roadmap** (Checkbox)
  - Generates personalized learning paths for identified gaps
  - Toggle to enable/disable
  
- **Auto-Generate Recommendations** (Checkbox)
  - Automatically suggests courses and resources
  - Toggle to enable/disable

#### Configuration History
- Displays last 10 configuration changes
- Shows timestamp and threshold values
- Scrollable list for easy reference
- Helps track configuration evolution

#### Action Buttons
- **Save Configuration**
  - Persists settings to localStorage
  - Adds entry to configuration history
  - Shows success notification (animated)
  - Disabled state during save
  
- **Reset to Default**
  - Restores all settings to default values
  - Clears unsaved changes

### Local Storage Integration
- Settings persisted in browser localStorage
- Configuration history saved locally
- Automatic recovery on page reload
- Maximum 10 history entries (auto-cleanup)

---

## Integration with Dashboard

### Advanced Tools Section
Both features appear as prominent cards in the "Advanced Tools" section:
- **Layout**: 2-column grid on medium+ screens, stacked on mobile
- **Visual Design**: Matching dashboard aesthetic with gradients
- **Quick Stats**: Summary statistics for quick overview
- **Quick Actions**: Direct navigation buttons

### Navigation
- Seamless tab switching from dashboard to full pages
- Breadcrumb context preserved
- Return navigation available

---

## Technical Implementation

### Components Used
- **RoleSkillMapping.js** - Full role-skill visualization
- **GapAnalysisConfig.js** - Configuration management
- **Dashboard.js** - Enhanced with preview cards

### APIs Integrated
- `adminAPI.getCategories()` - Category data
- `frameworkAPI.getFrameworks()` - Framework details
- `recommendationAPI.getStats()` - Analysis statistics
- LocalStorage - Configuration persistence

### State Management
- Component-level state with hooks
- Real-time updates
- Automatic calculations
- Error handling

### Styling
- Tailwind CSS consistent with design system
- Responsive layouts
- Interactive hover states
- Loading animations
- Empty states

---

## Usage Guide

### For Role-Skill Mapping
1. Navigate to "Role-Skill Mapping" from dashboard
2. Select a category from the category grid
3. View corresponding skill frameworks
4. Explore mapped roles and their required skills
5. Review statistics for insights

### For Gap Analysis Configuration
1. Navigate to "Gap Analysis Config" from dashboard
2. Adjust minimum/maximum thresholds using sliders
3. Select gap weighting strategy
4. Choose analysis mode
5. Enable/disable features as needed
6. Review configuration history
7. Save configuration when done

---

## Features Summary

| Feature | RoleSkillMapping | GapAnalysisConfig |
|---------|-----------------|------------------|
| Statistics | ✅ | ✅ |
| Category Management | ✅ | - |
| Configuration | - | ✅ |
| History Tracking | - | ✅ |
| Data Persistence | API | LocalStorage |
| Interactive Controls | ✅ | ✅ |
| Real-time Updates | ✅ | ✅ |
| Responsive Design | ✅ | ✅ |
| Error Handling | ✅ | ✅ |
| Empty States | ✅ | - |

---

## Future Enhancements

- Export/Import configuration
- Batch gap analysis
- Advanced reporting
- Role-skill matrix visualization
- API persistence for configurations
- Role recommendations based on gaps
- Skill roadmap generation
- Integration with learning management system
