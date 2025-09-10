import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (sessionToken: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://wordpress-site-health-analyzer.jamesiserman.workers.dev/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminSessionToken', data.sessionToken);
        onLogin(data.sessionToken);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#000',
            margin: '0 0 8px 0'
          }}>
            Admin Panel
          </h1>
          <p style={{
            color: '#86868b',
            fontSize: '16px',
            margin: '0'
          }}>
            Sign in to view analytics
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#000',
              marginBottom: '8px'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007aff'}
              onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#000',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d2d2d7',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007aff'}
              onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
            />
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#86868b' : '#000',
              color: 'white',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '980px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = '#333';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = '#000';
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
