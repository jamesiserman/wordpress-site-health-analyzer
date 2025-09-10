import React, { useState, useEffect, useCallback } from 'react';

interface SearchAnalytic {
  id: number;
  url: string;
  ip_address: string;
  country?: string;
  city?: string;
  region?: string;
  user_agent?: string;
  timestamp: string;
  overall_score?: number;
  security_score?: number;
  gdpr_score?: number;
  accessibility_score?: number;
  analysis_duration_ms?: number;
  error_message?: string;
}

interface AnalyticsSummary {
  totalSearches: number;
  averageScore: number;
  errorRate: number;
  topCountries: Array<{ country: string; count: number }>;
}

interface AdminDashboardProps {
  sessionToken: string;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ sessionToken, onLogout }) => {
  const [analytics, setAnalytics] = useState<SearchAnalytic[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch('https://wordpress-site-health-analyzer.jamesiserman.workers.dev/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnalytics(data.recentSearches || []);
        setSummary(data.summary);
      }
    } catch (err) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [sessionToken, onLogout]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleLogout = async () => {
    try {
      await fetch('https://wordpress-site-health-analyzer.jamesiserman.workers.dev/api/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('adminSessionToken');
      onLogout();
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getScoreColor = (score?: number) => {
    if (!score) return '#86868b';
    if (score >= 80) return '#34c759';
    if (score >= 60) return '#ff9500';
    return '#ff3b30';
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
          <p style={{ color: '#86868b', fontSize: '16px' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f7',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#000',
            margin: '0 0 8px 0'
          }}>
            Site Health Analytics
          </h1>
          <p style={{
            color: '#86868b',
            fontSize: '16px',
            margin: '0'
          }}>
            Monitor website analysis activity and performance
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#ff3b30',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '980px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#d70015'}
          onMouseOut={(e) => e.currentTarget.style.background = '#ff3b30'}
        >
          Sign Out
        </button>
      </div>

      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#86868b',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Searches
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#000',
              margin: '0'
            }}>
              {summary.totalSearches.toLocaleString()}
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#86868b',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Average Score
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: '700',
              color: getScoreColor(summary.averageScore),
              margin: '0'
            }}>
              {Math.round(summary.averageScore)}
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#86868b',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Error Rate
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: '700',
              color: summary.errorRate > 10 ? '#ff3b30' : '#34c759',
              margin: '0'
            }}>
              {Math.round(summary.errorRate)}%
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#86868b',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Top Countries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {summary.topCountries.slice(0, 3).map((country, index) => (
                <div key={country.country} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#000',
                    fontWeight: '500'
                  }}>
                    {country.country}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#86868b',
                    fontWeight: '600'
                  }}>
                    {country.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Searches Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#000',
          margin: '0 0 24px 0'
        }}>
          Recent Searches
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e5e7' }}>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 8px',
                  fontWeight: '600',
                  color: '#86868b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '12px'
                }}>
                  URL
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 8px',
                  fontWeight: '600',
                  color: '#86868b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '12px'
                }}>
                  Location
                </th>
                <th style={{
                  textAlign: 'center',
                  padding: '12px 8px',
                  fontWeight: '600',
                  color: '#86868b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '12px'
                }}>
                  Score
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 8px',
                  fontWeight: '600',
                  color: '#86868b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '12px'
                }}>
                  Time
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 8px',
                  fontWeight: '600',
                  color: '#86868b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '12px'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((search) => (
                <tr key={search.id} style={{
                  borderBottom: '1px solid #f2f2f7',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9fb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{
                    padding: '16px 8px',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    <div style={{
                      color: '#000',
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}>
                      {search.url || 'N/A'}
                    </div>
                    <div style={{
                      color: '#86868b',
                      fontSize: '12px'
                    }}>
                      {search.ip_address}
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ color: '#000', fontWeight: '500' }}>
                      {search.country || 'Unknown'}
                    </div>
                    {search.city && (
                      <div style={{
                        color: '#86868b',
                        fontSize: '12px'
                      }}>
                        {search.city}
                      </div>
                    )}
                  </td>
                  <td style={{
                    padding: '16px 8px',
                    textAlign: 'center'
                  }}>
                    {search.overall_score ? (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        background: getScoreColor(search.overall_score)
                      }}>
                        {search.overall_score}
                      </span>
                    ) : (
                      <span style={{ color: '#86868b' }}>—</span>
                    )}
                  </td>
                  <td style={{
                    padding: '16px 8px',
                    color: '#86868b'
                  }}>
                    {formatDate(search.timestamp)}
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    {search.error_message ? (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#ff3b30',
                        background: '#ffebee'
                      }}>
                        Error
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#34c759',
                        background: '#e8f5e8'
                      }}>
                        Success
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {analytics.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#86868b'
          }}>
            <p style={{ fontSize: '16px', margin: '0' }}>
              No search data available yet.
            </p>
          </div>
        )}
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
};

export default AdminDashboard;
