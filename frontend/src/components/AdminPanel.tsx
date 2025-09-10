import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminPanel: React.FC = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session token
    const token = localStorage.getItem('adminSessionToken');
    if (token) {
      // Validate token by making a test request
      validateSession(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateSession = async (token: string) => {
    try {
      const response = await fetch('https://wordpress-site-health-analyzer.jamesiserman.workers.dev/api/admin/analytics?limit=1', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSessionToken(token);
      } else {
        localStorage.removeItem('adminSessionToken');
      }
    } catch (error) {
      localStorage.removeItem('adminSessionToken');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token: string) => {
    setSessionToken(token);
  };

  const handleLogout = () => {
    setSessionToken(null);
    localStorage.removeItem('adminSessionToken');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f7'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e0e0e0',
            borderTop: '3px solid #007aff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#86868b', fontSize: '16px' }}>Checking authentication...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return sessionToken ? (
    <AdminDashboard sessionToken={sessionToken} onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
};

export default AdminPanel;
