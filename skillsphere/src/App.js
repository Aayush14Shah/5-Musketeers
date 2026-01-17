import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { authHelpers } from './services/api';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('auth');
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check URL path first
    const path = window.location.pathname;
    
    // If on admin route, check authentication
    if (path === '/admin' || path === '/admin/') {
      const { user: storedUser, token } = authHelpers.getAuth();
      
      // Only show admin if user is authenticated and is admin
      if (token && storedUser && storedUser.role === 'admin') {
        setUser(storedUser);
        setCurrentView('admin');
      } else {
        // Not authenticated or not admin - redirect to login
        setCurrentView('auth');
        setShowLogin(true);
        // Clear any invalid auth data
        if (!token || !storedUser || storedUser.role !== 'admin') {
          authHelpers.clearAuth();
        }
        // Update URL without redirecting (to avoid loop)
        window.history.replaceState({}, '', '/');
      }
      setIsCheckingAuth(false);
      return;
    }

    // For all other routes, check if user is logged in
    const { user: storedUser, token } = authHelpers.getAuth();
    if (token && storedUser) {
      setUser(storedUser);
      // If user is admin but not on admin route, they should go to login/auth
      // Only redirect to admin if they explicitly navigate there
      setCurrentView('auth');
    } else {
      // No user logged in - show login
      setCurrentView('auth');
      setShowLogin(true);
    }
    
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
      // Regular user - stay on auth page
      setCurrentView('auth');
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
