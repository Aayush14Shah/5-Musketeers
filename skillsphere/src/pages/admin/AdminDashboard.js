import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import JobRoleManagement from './JobRoleManagement';
import SkillFramework from './SkillFramework';
import RoleSkillMapping from './RoleSkillMapping';
import GapAnalysisConfig from './GapAnalysisConfig';
import Recommendations from './Recommendations';
import Analysis from './Analysis';


const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'job-role-management':
        return <JobRoleManagement />;
      case 'skill-framework':
        return <SkillFramework />;
      case 'role-skill-mapping':
        return <RoleSkillMapping />;
      case 'gap-analysis-config':
        return <GapAnalysisConfig />;
      case 'recommendations':
        return <Recommendations />;
      case 'analysis':
        return <Analysis />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={onLogout}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
