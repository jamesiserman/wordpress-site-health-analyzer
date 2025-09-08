# WordPress Site Health Analyzer

A comprehensive full-stack application that analyzes WordPress websites for security vulnerabilities, GDPR compliance, and accessibility issues.

## Features

### 🔒 Security Analysis
- WordPress version detection
- Plugin and theme identification
- Known vulnerability checking
- Security score calculation (50% of overall score)

### 🛡️ GDPR Compliance
- Cookie banner detection
- Privacy policy link detection
- Tracking script identification (Google Analytics, Meta Pixel, etc.)
- GDPR compliance score (25% of overall score)

### ♿ Accessibility Analysis
- Missing alt text detection
- Heading hierarchy validation
- ARIA label checking
- Accessibility score (25% of overall score)

### 📱 Mobile Preview
- Desktop and mobile viewport toggle
- Responsive iframe preview
- 375px mobile width simulation

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **Lucide React** icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Cheerio** for HTML parsing
- **Axios** for HTTP requests

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wordpress-site-health-analyzer
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The web app will be available at `http://localhost:3000`

### Production Mode

1. **Build and start the backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

## API Endpoints

### `GET /api/analyze?url=<website-url>`

Analyzes a WordPress website and returns comprehensive health data.

**Parameters:**
- `url` (required): The WordPress website URL to analyze

**Response:**
```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "security": {
    "isWordPress": true,
    "wordpressVersion": "6.4.1",
    "vulnerabilities": [],
    "plugins": [],
    "themes": [],
    "score": 85
  },
  "gdpr": {
    "hasCookieBanner": true,
    "hasPrivacyPolicy": true,
    "trackers": [],
    "score": 90
  },
  "accessibility": {
    "missingAltImages": 2,
    "headingIssues": [],
    "missingAriaLabels": 1,
    "score": 75
  },
  "overallScore": 82,
  "categoryScores": {
    "security": 85,
    "gdpr": 90,
    "accessibility": 75
  },
  "recommendations": []
}
```

## Architecture

### Backend Services

- **WordPressAnalyzer**: Main orchestrator service
- **SecurityAnalyzer**: WordPress security analysis
- **GDPRAnalyzer**: Privacy compliance checking
- **AccessibilityAnalyzer**: Accessibility validation
- **ScoreCalculator**: Weighted scoring system

### Frontend Components

- **UrlInput**: Website URL input form
- **ScoreCard**: Analysis results display
- **MobilePreview**: Responsive website preview
- **UI Components**: Reusable Shadcn/UI components

## Scoring System

The overall health score is calculated using weighted averages:

- **Security**: 50% weight
- **GDPR**: 25% weight  
- **Accessibility**: 25% weight

### Score Grades
- **A**: 90-100 points
- **B**: 80-89 points
- **C**: 70-79 points
- **D**: 60-69 points
- **F**: Below 60 points

## Future Enhancements

- PDF report generation
- Advanced plugin/theme fingerprinting
- Integration with WPScan API
- Performance analysis
- SEO checks
- Batch analysis for multiple sites
- Historical tracking
- Email notifications

## Security Considerations

- Input validation and sanitization
- CORS protection
- Rate limiting (recommended for production)
- Secure headers with Helmet.js
- Sandboxed iframe previews

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue on the repository.
