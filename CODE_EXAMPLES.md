# Code Examples & Integration Patterns

## Example 1: Using RoleSkillMapping in Dashboard

### Basic Integration
```javascript
// In Dashboard.js
import RoleSkillMapping from './RoleSkillMapping';

// In render:
<button onClick={() => setActiveTab('role-skill-mapping')}>
  Explore Mappings
</button>

// Component will handle all data loading and display
```

### Accessing Component Data
```javascript
// Component internally manages:
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(null);
const [frameworks, setFrameworks] = useState([]);
const [stats, setStats] = useState({ 
  totalRoles: 0, 
  totalSkills: 0, 
  mappings: 0 
});

// Data flows from API -> State -> UI
```

---

## Example 2: Using GapAnalysisConfig in Dashboard

### Basic Integration
```javascript
// In Dashboard.js
import GapAnalysisConfig from './GapAnalysisConfig';

// In render:
<button onClick={() => setActiveTab('gap-analysis-config')}>
  Configure Settings
</button>

// Component will handle all configuration management
```

### Accessing Saved Configuration
```javascript
// Retrieve from localStorage
const savedConfig = JSON.parse(
  localStorage.getItem('gapAnalysisConfig') || 
  JSON.stringify({
    minThreshold: 60,
    maxThreshold: 100,
    gapWeighting: 'balanced',
    analysisMode: 'comprehensive',
    includeRoadmap: true,
    autoRecommend: true,
  })
);

// Use in other components:
if (savedConfig.includeRoadmap) {
  generateRoadmap();
}
```

---

## Example 3: API Integration Patterns

### Loading Categories and Frameworks
```javascript
// Pattern: Load categories, then filter frameworks
const loadCategoryData = async (categoryId) => {
  try {
    // Step 1: Load categories
    const categoriesRes = await adminAPI.getCategories();
    const categories = categoriesRes.data;
    
    // Step 2: Load frameworks for selected category
    const frameworksRes = await frameworkAPI.getFrameworks({ 
      category: categoryId 
    });
    const frameworks = frameworksRes.data;
    
    // Step 3: Calculate statistics
    const stats = calculateStats(categories);
    
    // Step 4: Update state
    setCategories(categories);
    setFrameworks(frameworks);
    setStats(stats);
    
  } catch (error) {
    console.error('Error loading data:', error);
    // Handle error gracefully
  }
};

// Usage:
useEffect(() => {
  loadCategoryData(selectedCategory);
}, [selectedCategory]);
```

### Loading Statistics
```javascript
// Pattern: Load stats from API and handle errors
const loadStats = async () => {
  try {
    const response = await recommendationAPI.getStats();
    setStats({
      totalAnalyses: response.data?.totalAnalyses || 0,
      averageGap: response.data?.averageGap || 0,
      recommendationsGenerated: response.data?.recommendations || 0,
    });
  } catch (error) {
    console.error('Error loading stats:', error);
    // Provide sensible defaults
    setStats({
      totalAnalyses: 0,
      averageGap: 0,
      recommendationsGenerated: 0,
    });
  }
};

// Usage:
useEffect(() => {
  loadStats();
}, []);
```

---

## Example 4: LocalStorage Patterns

### Saving Configuration
```javascript
// Pattern: Save to localStorage with validation
const saveConfiguration = (config) => {
  try {
    // Validate configuration
    if (config.minThreshold < 0 || config.minThreshold > 100) {
      throw new Error('Invalid minimum threshold');
    }
    if (config.maxThreshold < 0 || config.maxThreshold > 100) {
      throw new Error('Invalid maximum threshold');
    }
    
    // Save configuration
    localStorage.setItem('gapAnalysisConfig', JSON.stringify(config));
    
    // Add to history
    const history = JSON.parse(
      localStorage.getItem('configHistory') || '[]'
    );
    history.push({
      timestamp: new Date().toISOString(),
      config: { ...config }
    });
    
    // Keep only last 10 entries
    if (history.length > 10) {
      history.shift();
    }
    
    localStorage.setItem('configHistory', JSON.stringify(history));
    
    return true;
  } catch (error) {
    console.error('Error saving configuration:', error);
    return false;
  }
};

// Usage:
if (saveConfiguration(config)) {
  showSuccessMessage('Configuration saved');
} else {
  showErrorMessage('Failed to save configuration');
}
```

### Loading Configuration with Defaults
```javascript
// Pattern: Load with fallback defaults
const loadConfiguration = () => {
  const DEFAULT_CONFIG = {
    minThreshold: 60,
    maxThreshold: 100,
    gapWeighting: 'balanced',
    analysisMode: 'comprehensive',
    includeRoadmap: true,
    autoRecommend: true,
  };
  
  try {
    const saved = localStorage.getItem('gapAnalysisConfig');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error parsing saved config:', error);
  }
  
  return DEFAULT_CONFIG;
};

// Usage:
const config = loadConfiguration();
setConfig(config);
```

---

## Example 5: React Hooks Patterns

### useEffect for API Calls
```javascript
// Pattern: Load data on component mount
useEffect(() => {
  let isMounted = true;
  
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCategories();
      
      if (isMounted) {
        setCategories(response.data || []);
      }
    } catch (error) {
      if (isMounted) {
        console.error('Error:', error);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };
  
  loadData();
  
  // Cleanup
  return () => {
    isMounted = false;
  };
}, []); // Run only once on mount
```

### useEffect with Dependencies
```javascript
// Pattern: Reload when dependency changes
useEffect(() => {
  if (selectedCategory) {
    loadFrameworksForCategory(selectedCategory);
  }
}, [selectedCategory]); // Run when selectedCategory changes
```

---

## Example 6: State Update Patterns

### Handling Form Changes
```javascript
// Pattern: Update nested object state
const handleConfigChange = (field, value) => {
  setConfig(prevConfig => ({
    ...prevConfig,
    [field]: value
  }));
  setSaved(false); // Mark as unsaved
};

// Usage:
<input 
  type="range" 
  value={config.minThreshold}
  onChange={(e) => handleConfigChange('minThreshold', e.target.value)}
/>
```

### Calculated State
```javascript
// Pattern: Calculate derived values without API calls
const calculateStats = (categories) => {
  const stats = {
    totalRoles: 0,
    totalSkills: 0,
    mappings: 0
  };
  
  categories.forEach(category => {
    stats.totalRoles += category.jobRoles?.length || 0;
    
    category.jobRoles?.forEach(role => {
      const skillCount = role.requiredSkills?.length || 0;
      stats.totalSkills += skillCount;
      if (skillCount > 0) {
        stats.mappings += 1;
      }
    });
  });
  
  return stats;
};

// Usage:
const stats = calculateStats(categories);
setStats(stats);
```

---

## Example 7: Component Composition

### Creating Reusable Components
```javascript
// Pattern: Extract repeated UI into component
const StatCard = ({ label, value, color, icon }) => (
  <div className={`bg-${color}-50 rounded-lg p-4 border border-${color}-200`}>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    {icon && <span className="text-2xl mt-2">{icon}</span>}
  </div>
);

// Usage:
<StatCard 
  label="Total Roles" 
  value={stats.totalRoles} 
  color="blue"
  icon="👔"
/>
```

### Conditional Rendering
```javascript
// Pattern: Show different UI based on state
{frameworks && frameworks.length > 0 ? (
  <table>
    {frameworks.map(fw => (
      <tr key={fw._id}>
        <td>{fw.name}</td>
        {/* ... */}
      </tr>
    ))}
  </table>
) : (
  <div className="text-center py-8">
    <p>No frameworks found</p>
  </div>
)}
```

---

## Example 8: Error Handling

### Try-Catch Pattern
```javascript
// Pattern: Handle API errors gracefully
try {
  const response = await apiCall();
  setData(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
    redirectToLogin();
  } else if (error.response?.status === 404) {
    // Not found
    setError('Data not found');
  } else {
    // Generic error
    setError('Failed to load data');
  }
  console.error('Error:', error);
}
```

### Toast Notification Pattern
```javascript
// Pattern: Show temporary notifications
const showNotification = (message, duration = 3000) => {
  setNotification({ message, visible: true });
  
  setTimeout(() => {
    setNotification({ message: '', visible: false });
  }, duration);
};

// Usage:
if (saveSuccess) {
  showNotification('Configuration saved successfully');
}
```

---

## Example 9: Performance Optimization

### Memoization Pattern
```javascript
// Pattern: Avoid unnecessary recalculations
const memoizedStats = useMemo(() => {
  return calculateStats(categories);
}, [categories]);

// Only recalculate when categories changes
```

### Debouncing Pattern
```javascript
// Pattern: Avoid excessive API calls
const debouncedSearch = useMemo(
  () => debounce((query) => {
    searchCategories(query);
  }, 300),
  []
);

// Usage:
const handleSearch = (e) => {
  debouncedSearch(e.target.value);
};
```

---

## Example 10: Complete Component Example

### Minimal RoleSkillMapping Usage
```javascript
import React, { useState, useEffect } from 'react';
import { adminAPI, frameworkAPI } from '../../services/api';

const MyCustomRoleSkillView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const categoriesRes = await adminAPI.getCategories();
      const categories = categoriesRes.data;

      // Load frameworks for first category
      if (categories.length > 0) {
        const frameworksRes = await frameworkAPI.getFrameworks({
          category: categories[0]._id
        });

        setData({
          categories,
          selectedCategory: categories[0]._id,
          frameworks: frameworksRes.data
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Role-Skill Overview</h1>
      <p>Categories: {data?.categories?.length || 0}</p>
      <p>Frameworks: {data?.frameworks?.length || 0}</p>
    </div>
  );
};

export default MyCustomRoleSkillView;
```

---

## Example 11: Testing Patterns

### Testing API Calls
```javascript
// Test: Verify API call on mount
test('loads categories on mount', async () => {
  const mockCategories = [{ _id: '1', name: 'IT' }];
  adminAPI.getCategories.mockResolvedValue({ 
    data: mockCategories 
  });

  render(<RoleSkillMapping />);

  await waitFor(() => {
    expect(adminAPI.getCategories).toHaveBeenCalled();
  });
});
```

### Testing State Updates
```javascript
// Test: Verify configuration saves
test('saves configuration to localStorage', () => {
  const config = {
    minThreshold: 70,
    maxThreshold: 95,
    gapWeighting: 'conservative',
    analysisMode: 'quick',
    includeRoadmap: false,
    autoRecommend: false
  };

  saveConfiguration(config);

  expect(localStorage.getItem('gapAnalysisConfig')).toEqual(
    JSON.stringify(config)
  );
});
```

---

## Example 12: Advanced Patterns

### Custom Hook Pattern
```javascript
// Create reusable logic
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, loading, refetch: loadCategories };
};

// Usage:
const { categories, loading } = useCategories();
```

### Higher Order Component Pattern
```javascript
// Wrap component with additional functionality
const withDataLoading = (Component) => {
  return (props) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      // Load data...
      setLoading(false);
    }, []);

    return (
      <Component 
        data={data} 
        loading={loading} 
        {...props} 
      />
    );
  };
};

// Usage:
export default withDataLoading(RoleSkillMapping);
```

---

## Summary

These patterns demonstrate:
1. ✅ API integration best practices
2. ✅ React hooks patterns
3. ✅ State management
4. ✅ Error handling
5. ✅ LocalStorage usage
6. ✅ Component composition
7. ✅ Performance optimization
8. ✅ Testing approaches
9. ✅ Custom hooks
10. ✅ Advanced component patterns

All examples follow React best practices and can be adapted for your specific needs.
