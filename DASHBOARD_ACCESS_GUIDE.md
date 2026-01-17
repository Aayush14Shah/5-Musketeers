# Quick Access Guide - Dashboard Features

## 🎯 Where to Find New Features

### From Admin Dashboard

#### Option 1: Advanced Tools Cards (Recommended)
1. Go to Admin Dashboard
2. Scroll down to **"Advanced Tools"** section
3. Find the two new cards:
   - 🔗 **Role-Skill Mapping Card** (Left)
   - ⚙️ **Gap Analysis Config Card** (Right)
4. Click "Explore Mappings" or "Configure Settings" buttons

#### Option 2: Sidebar Navigation
1. Go to Admin Dashboard
2. Use left sidebar menu:
   - Select **"Role-Skill Mapping"** tab
   - OR Select **"Gap Analysis Configuration"** tab

---

## 🔗 Role-Skill Mapping

### Quick Stats
- 👔 **Total Job Roles** - All mapped roles
- 🎯 **Total Skills** - Complete skill inventory
- 🔗 **Active Mappings** - Role-skill connections

### Main Features
1. **Category Selection** - Choose from available categories
2. **Framework Viewer** - See skill frameworks with details
3. **Role Details** - View roles with required skills
4. **Skill Badges** - Visual skill representation

### How to Use
```
1. Open Role-Skill Mapping page
2. Select a category from the grid
3. View frameworks and mapped roles
4. Explore required skills for each role
5. Use category filters for different job sectors
```

### Data Shown
- Framework name and domain
- Number of skills per framework
- Proficiency levels
- Active status
- Mapped roles with required skills

---

## ⚙️ Gap Analysis Configuration

### Quick Stats
- 📊 **Total Analyses** - Previous analyses count
- 📈 **Average Gap** - Typical skill gap percentage
- 💡 **Recommendations** - Generated suggestions count

### Main Features
1. **Threshold Sliders** - Min (60%) and Max (100%)
2. **Gap Weighting** - Conservative/Balanced/Aggressive
3. **Analysis Mode** - Quick Scan or Comprehensive
4. **Feature Toggles** - Learning Roadmap & Auto Recommendations
5. **Configuration History** - Track last 10 changes

### How to Use
```
1. Open Gap Analysis Configuration page
2. Adjust minimum/maximum thresholds
3. Select gap weighting strategy
4. Choose analysis mode
5. Enable/disable features
6. Click "Save Configuration"
7. View configuration history if needed
```

### Configuration Options

#### Thresholds
- **Minimum Threshold**: Skills below this level are flagged as gaps
- **Maximum Threshold**: Target proficiency level for development

#### Gap Weighting
- 🔒 **Conservative**: Stricter detection (detect more gaps)
- ⚖️ **Balanced**: Standard detection (default)
- 🚀 **Aggressive**: Broader detection (detect fewer gaps)

#### Analysis Mode
- **Quick Scan**: Fast analysis for rapid assessments
- **Comprehensive**: Detailed analysis for thorough evaluation

#### Features
- **Learning Roadmap**: Generate personalized learning paths
- **Auto Recommendations**: Get automatic course suggestions

---

## 📱 Dashboard Integration

### Advanced Tools Section Layout
```
┌─────────────────────────────────────────┐
│         ADVANCED TOOLS                  │
├──────────────────┬──────────────────────┤
│                  │                      │
│  Role-Skill      │  Gap Analysis        │
│  Mapping         │  Configuration       │
│                  │                      │
│  • Total Roles   │  • Min Threshold     │
│  • Mapped Skills │  • Max Threshold     │
│  • Categories    │  • Settings Status   │
│                  │                      │
│  [Explore]       │  [Configure]         │
│                  │                      │
├──────────────────┴──────────────────────┤
│                                          │
└─────────────────────────────────────────┘
```

### Quick Actions
- **From Dashboard**: Click preview card buttons
- **From Sidebar**: Select tab from navigation menu
- **Return**: Use browser back or dashboard link

---

## 💾 Data Persistence

### Role-Skill Mapping
- **Data Source**: Backend API
- **Storage**: Database (Category & Framework models)
- **Persistence**: Automatic
- **Updates**: Real-time via API

### Gap Analysis Configuration
- **Data Source**: LocalStorage (browser)
- **Default Values**: 
  - Min Threshold: 60%
  - Max Threshold: 100%
  - Gap Weighting: Balanced
  - Analysis Mode: Comprehensive
  - Features: All enabled
- **History**: Last 10 configurations saved
- **Actions**: Save/Reset available

---

## ✨ Pro Tips

### For Role-Skill Mapping
- Use category filters to focus on specific job sectors
- Hover over skill badges to see full skill names
- Review mapped skills to understand role requirements
- Track total skills for capacity planning

### For Gap Analysis Configuration
- Start with **Balanced** weighting for standard analysis
- Use **Conservative** mode for strict assessment
- Save configurations before making major changes
- Check history to compare different settings
- Enable Roadmap for proactive skill development
- Use Auto Recommendations for time efficiency

---

## 🔄 Workflow Examples

### Scenario 1: Adding New Job Roles
1. Use CSV upload in "Upload CSV Data" section
2. Navigate to Role-Skill Mapping
3. Select category to view new mappings
4. Verify skills are correctly mapped

### Scenario 2: Analyzing Skill Gaps
1. Go to Gap Analysis Configuration
2. Adjust thresholds based on requirements
3. Select appropriate weighting
4. Enable roadmap for development paths
5. Save configuration
6. Run analysis with new settings

### Scenario 3: Reviewing All Skills
1. Open Role-Skill Mapping
2. Browse all categories
3. Note total skills and mappings
4. Identify gaps in coverage
5. Plan for new framework additions

---

## 📊 Key Metrics

| Metric | Location | Use Case |
|--------|----------|----------|
| Total Roles | Dashboard & RSM Page | Capacity overview |
| Total Skills | Dashboard & RSM Page | Inventory assessment |
| Active Mappings | RSM Page | Coverage status |
| Avg Gap % | Gap Config Page | Performance baseline |
| Analysis Count | Gap Config Page | Usage tracking |
| Recommendations | Gap Config Page | Suggestion activity |

---

## ❓ Troubleshooting

### No Data Showing in Role-Skill Mapping
- Upload CSV data first using "Upload CSV Data" button
- Ensure categories are imported
- Check browser console for errors
- Refresh page to reload data

### Configuration Not Saving
- Check browser console for errors
- Ensure cookies/storage are enabled
- Try resetting to defaults
- Check browser storage quota

### Threshold Sliders Not Moving
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser compatibility
- Clear browser cache if needed

---

## 🆘 Support

For issues or questions:
1. Check error messages in browser console
2. Review this guide's troubleshooting section
3. Contact development team with:
   - Screenshot of issue
   - Error message from console
   - Steps to reproduce
   - Browser/OS information
