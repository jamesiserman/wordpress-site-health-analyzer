-- Database schema for Site Health Analytics

-- Table to store search analytics
CREATE TABLE IF NOT EXISTS search_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    country TEXT,
    city TEXT,
    region TEXT,
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    overall_score INTEGER,
    security_score INTEGER,
    gdpr_score INTEGER,
    accessibility_score INTEGER,
    analysis_duration_ms INTEGER,
    error_message TEXT
);

-- Table to store admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_token TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    ip_address TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_search_analytics_timestamp ON search_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_search_analytics_country ON search_analytics(country);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
