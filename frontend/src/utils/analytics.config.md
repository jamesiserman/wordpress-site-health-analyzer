# Analytics & Monitoring Configuration Guide

This document describes how to set up and configure analytics for Tessera.

## Google Analytics 4 Setup

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property for Tessera
3. Set up a web stream for your domain
4. Copy the Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Add your GA4 ID to `.env` file:

```bash
REACT_APP_GA4_ID=G-XXXXXXXXXX
```

For production deployment on Cloudflare Pages, add to environment variables:

```bash
REACT_APP_GA4_ID=G-XXXXXXXXXX
```

### 3. Tracked Events

The analytics module automatically tracks:

#### Page Views
- `page_view` - Every page load with page title and path

#### Conversion Events
- `scan_initiated` - When user starts a website scan
  - URL being scanned
  - Timestamp

- `scan_completed` - When scan finishes
  - URL scanned
  - Compliance score (0-100)
  - Duration in seconds

- `sign_up` - When user creates account

- `pricing_viewed` - When user visits pricing page

- `plan_selected` - When user selects a pricing plan
  - Plan name (Starter, Growth, Enterprise)

#### Web Vitals
- `web_vital_lcp` - Largest Contentful Paint (page speed)
- `web_vital_fid` - First Input Delay (interactivity)
- `web_vital_cls` - Cumulative Layout Shift (visual stability)

#### Performance Metrics
- `page_load_time` - Total page load duration
- `performance_metric` - Resource and navigation timing

#### Error Tracking
- `javascript_error` - JavaScript runtime errors
  - Message, filename, line number, stack trace
- `unhandled_promise_rejection` - Unhandled promise rejections

## Google Analytics Reports to Set Up

### 1. Real-time Dashboard
Monitor live user activity:
- Current users
- Recent page views
- Recent events

### 2. Conversion Funnel
Track user journey:
1. Home page view
2. Scan initiated
3. Scan completed
4. Pricing page viewed
5. Sign up

### 3. Web Vitals Report
Monitor performance:
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- Performance by page

### 4. Custom Dashboard
Create dashboard with:
- Scans per day
- Average compliance score
- User retention
- Top error types

## Error Tracking (Optional: Sentry)

### 1. Create Sentry Account

1. Sign up at [Sentry.io](https://sentry.io)
2. Create a new project for React
3. Copy the DSN (Data Source Name)

### 2. Install Sentry SDK

```bash
npm install @sentry/react @sentry/tracing
```

### 3. Initialize Sentry

Add to `src/index.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Sentry.Replay(),
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 4. Configure Environment Variables

```bash
REACT_APP_SENTRY_DSN=https://xxxxx@sentry.io/12345
```

## Performance Monitoring Tools

### Lighthouse
- Chrome DevTools → Lighthouse tab
- Measure: Performance, Accessibility, Best Practices, SEO
- Target: 90+ scores

### Web Vitals
Built-in web vitals tracking measures:
- **LCP (Largest Contentful Paint)**: < 2.5 seconds (good)
- **FID (First Input Delay)**: < 100 milliseconds (good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (good)

### Cloudflare Analytics
- Monitor page views
- Track bot traffic
- View geographic distribution
- Check error rates

## Monitoring Alerts

### GA4 Alerts to Create

1. **High Error Rate Alert**
   - Trigger: javascript_error events > 10 per hour
   - Action: Notify team

2. **Low Scan Completion Rate**
   - Trigger: scan_completed events < 80% of scan_initiated
   - Action: Investigate API issues

3. **Performance Degradation**
   - Trigger: page_load_time > 5 seconds average
   - Action: Check CDN and server performance

4. **Unusual Traffic Pattern**
   - Trigger: Traffic drops > 50% from daily average
   - Action: Check for incidents

## Accessing Analytics

### GA4 Dashboard
- Home: Real-time overview
- Reports: Pre-built and custom reports
- Explore: Advanced analysis
- Conversions: Track key events

### Creating Custom Reports

1. Go to Reports → Explore
2. Select data source (GA4 property)
3. Add dimensions (page, source, device)
4. Add metrics (users, events, conversion)
5. Save as custom report

## Privacy & Compliance

### GDPR Compliance
- Anonymize IP addresses (enabled by default)
- Allow users to opt-out of analytics
- Document data retention (14 months default)

### Privacy Policy Update
Add to privacy policy:

```
We use Google Analytics 4 to understand how users interact
with our website. Data is collected anonymously and used to
improve our service. You can opt-out using your browser settings.
```

### User Opt-Out Option
Consider adding analytics opt-out:

```typescript
function disableAnalytics() {
  (window as any)['ga-disable-' + GA4_ID] = true;
}
```

## Testing Analytics

### 1. Enable Debug View
In Google Analytics:
- Admin → Property Settings → Data Streams
- Enable "Enhanced measurement"
- Use GA4 DebugView to see events in real-time

### 2. Test Events in Browser Console
```javascript
gtag('event', 'test_event', {
  test: true
});
```

### 3. Verify in GA4
- Open GA4 → Reports → Real-time
- Should see test events appear within seconds

## Deployment

### Environment Variables for Production

Set these in Cloudflare Pages environment:
```
REACT_APP_GA4_ID=G-XXXXXXXXXX
REACT_APP_SENTRY_DSN=https://xxxxx@sentry.io/12345
```

### Verify Tracking Works
1. Deploy to production
2. Visit website in browser
3. Open DevTools → Network tab
4. Look for requests to `www.google-analytics.com`
5. Perform test action (scan, click pricing)
6. Check GA4 Real-time Report

## Support & Documentation

- [Google Analytics 4 Help](https://support.google.com/analytics/topic/9756891)
- [GA4 Implementation Guide](https://support.google.com/analytics/answer/9310895)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
