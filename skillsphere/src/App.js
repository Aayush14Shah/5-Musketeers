import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { authHelpers } from './services/api';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('auth');
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const { user: storedUser, token } = authHelpers.getAuth();
    
    // Default route (/) - always show login page
    if (path === '/' || path === '') {
      setCurrentView('auth');
      setShowLogin(true);
      setIsCheckingAuth(false);
      return;
    }

    // If on admin route, check authentication
    if (path === '/admin' || path === '/admin/') {
      // Only show admin if user is authenticated and is admin
      if (token && storedUser && storedUser.role === 'admin') {
        setUser(storedUser);
        setCurrentView('admin');
      } else {
        // Not authenticated or not admin - redirect to login
        authHelpers.clearAuth();
        setCurrentView('auth');
        setShowLogin(true);
        window.history.replaceState({}, '', '/');
      }
      setIsCheckingAuth(false);
      return;
    }

    // Check if user is on dashboard route
    if (path === '/dashboard' || path === '/dashboard/') {
      if (token && storedUser) {
        setUser(storedUser);
        if (storedUser.role === 'admin') {
          setCurrentView('admin');
          window.history.replaceState({}, '', '/admin');
        } else {
          setCurrentView('dashboard');
        }
      } else {
        // Not authenticated - redirect to login
        authHelpers.clearAuth();
        setCurrentView('auth');
        setShowLogin(true);
        window.history.replaceState({}, '', '/');
      }
      setIsCheckingAuth(false);
      return;
    }

    // For any other routes, show login
    authHelpers.clearAuth();
    setCurrentView('auth');
    setShowLogin(true);
    window.history.replaceState({}, '', '/');
    setIsCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    authHelpers.clearAuth();
    setUser(null);
    setCurrentView('auth');
    setShowLogin(true);
    window.history.replaceState({}, '', '/');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      // Admin login - redirect to admin dashboard
      setCurrentView('admin');
      window.history.pushState({}, '', '/admin');
    } else {
      // Regular user - redirect to user dashboard
      setCurrentView('dashboard');
      window.history.pushState({}, '', '/dashboard');
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-900">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin dashboard only if on admin route and authenticated
  if (currentView === 'admin' && user && user.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Show user dashboard for regular users
  if (currentView === 'dashboard' && user && user.role === 'student') {
    return <UserDashboard onLogout={handleLogout} />;
  }

  // Default: Show login/register
  return (
    <div className="App">
      {showLogin ? (
        <Login 
          onSwitchToRegister={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Register onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;
