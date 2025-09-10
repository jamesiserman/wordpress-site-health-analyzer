# WordPress Site Health Analyzer - Cloudflare Worker

This is the serverless backend for the WordPress Site Health Analyzer, built as a Cloudflare Worker.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Wrangler CLI globally (if not already installed):
```bash
npm install -g wrangler
```

3. Login to Cloudflare:
```bash
wrangler login
```

4. Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Development

Run locally:
```bash
npm run dev
```

## API Endpoints

- `GET /api/analyze?url=<website-url>` - Analyze a WordPress website
- `GET /health` - Health check endpoint

## Features

- **Security Analysis**: WordPress detection, version checking, vulnerability scanning
- **GDPR Compliance**: Cookie banner detection, privacy policy checks, tracker identification
- **Accessibility**: Alt text validation, heading structure analysis, ARIA label checks
- **Scoring**: Weighted scoring system with recommendations

## Deployment

The worker will be deployed to:
- Production: `https://wordpress-site-health-analyzer.your-subdomain.workers.dev`
- Development: `https://wordpress-site-health-analyzer-dev.your-subdomain.workers.dev`

Update the frontend API configuration to use your actual worker URL after deployment.
