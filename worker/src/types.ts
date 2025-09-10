export interface AnalysisResult {
  url: string;
  timestamp: string;
  security: SecurityResult;
  gdpr: GDPRResult;
  accessibility: AccessibilityResult;
  overallScore: number;
  categoryScores: {
    security: number;
    gdpr: number;
    accessibility: number;
  };
  recommendations: Recommendation[];
}

export interface SecurityResult {
  sslCertificate: SSLCertificate;
  securityHeaders: SecurityHeaders;
  consoleWarnings: ConsoleWarning[];
  reputationChecks: ReputationCheck[];
  vulnerabilities: Vulnerability[];
  score: number;
}

export interface SSLCertificate {
  isValid: boolean;
  issuer?: string;
  expiryDate?: string;
  grade?: string;
  warnings: string[];
}

export interface SecurityHeaders {
  contentSecurityPolicy: boolean;
  strictTransportSecurity: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  referrerPolicy: boolean;
  permissionsPolicy: boolean;
  score: number;
}

export interface ConsoleWarning {
  type: 'security' | 'mixed-content' | 'deprecated' | 'vulnerability';
  message: string;
  severity: 'low' | 'medium' | 'high';
  source?: string;
}

export interface ReputationCheck {
  service: string;
  status: 'clean' | 'warning' | 'malicious' | 'unknown';
  details?: string;
  lastChecked: string;
}

export interface GDPRResult {
  hasCookieBanner: boolean;
  hasPrivacyPolicy: boolean;
  trackers: Tracker[];
  score: number;
}

export interface AccessibilityResult {
  missingAltImages: number;
  headingIssues: string[];
  missingAriaLabels: number;
  score: number;
}

export interface Vulnerability {
  component: string;
  version?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface Plugin {
  name: string;
  version?: string;
  slug: string;
}

export interface Theme {
  name: string;
  version?: string;
  slug: string;
}

export interface Tracker {
  name: string;
  type: 'analytics' | 'advertising' | 'social' | 'other';
  detected: boolean;
}

export interface Recommendation {
  category: 'security' | 'gdpr' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action: string;
}
