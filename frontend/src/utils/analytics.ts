/**
 * Analytics & Monitoring Utilities
 * Handles Google Analytics 4, event tracking, and performance monitoring
 */

// Google Analytics 4 Configuration
export const GA4_ID = process.env.REACT_APP_GA4_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics 4
export function initializeGA4(): void {
  if (!window.location.hostname.includes('localhost')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: any[]): void => {
      window.dataLayer.push(args);
    };
    gtag('js', new Date());
    gtag('config', GA4_ID, {
      page_path: window.location.pathname,
      anonymize_ip: true,
    });

    (window as any).gtag = gtag;
  }
}

// Track page views
export function trackPageView(pageName: string): void {
  if ((window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: pageName,
      page_path: window.location.pathname,
    });
  }
}

// Track conversion events
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, eventData || {});
  }
}

// Track scan initiation
export function trackScanInitiated(url: string): void {
  trackEvent('scan_initiated', {
    url: url,
    timestamp: new Date().toISOString(),
  });
}

// Track scan completed
export function trackScanCompleted(
  url: string,
  score: number,
  duration: number
): void {
  trackEvent('scan_completed', {
    url: url,
    score: score,
    duration_seconds: duration,
    timestamp: new Date().toISOString(),
  });
}

// Track signup/account creation
export function trackSignup(): void {
  trackEvent('sign_up', {
    timestamp: new Date().toISOString(),
  });
}

// Track pricing page visit
export function trackPricingView(): void {
  trackEvent('pricing_viewed', {
    timestamp: new Date().toISOString(),
  });
}

// Track plan selection
export function trackPlanSelected(planName: string): void {
  trackEvent('plan_selected', {
    plan: planName,
    timestamp: new Date().toISOString(),
  });
}

// Setup Web Vitals tracking
export function setupWebVitalsTracking(): void {
  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).startTime) {
            trackEvent('web_vital_lcp', {
              value: Math.round((entry as any).startTime),
              metric: 'LCP',
            });
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.log('LCP tracking not supported');
    }
  }

  // Track First Input Delay (FID) via web-vitals library
  // This would typically use: import { getFID } from 'web-vitals'
  // For now, we'll use a simple approximation
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackEvent('web_vital_fid', {
            value: Math.round((entry as any).processingDuration),
            metric: 'FID',
          });
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.log('FID tracking not supported');
    }
  }

  // Track Cumulative Layout Shift (CLS)
  if ('PerformanceObserver' in window) {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            trackEvent('web_vital_cls', {
              value: Math.round(clsValue * 100),
              metric: 'CLS',
            });
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.log('CLS tracking not supported');
    }
  }
}

// Setup error tracking
export function setupErrorTracking(): void {
  window.addEventListener('error', (event) => {
    trackEvent('javascript_error', {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      stack: event.error?.stack,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackEvent('unhandled_promise_rejection', {
      reason: event.reason?.message || String(event.reason),
    });
  });
}

// Setup performance monitoring
export function setupPerformanceMonitoring(): void {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackEvent('performance_metric', {
            name: entry.name,
            duration: Math.round((entry as any).duration),
            startTime: Math.round(entry.startTime),
          });
        }
      });
      observer.observe({
        entryTypes: ['measure', 'navigation', 'resource'],
      });
    } catch (e) {
      console.log('Performance monitoring not supported');
    }
  }

  // Track page load time
  window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const pageLoadTime =
        timing.loadEventEnd - timing.navigationStart;
      trackEvent('page_load_time', {
        duration_ms: pageLoadTime,
      });
    }
  });
}

// Initialize all analytics
export function initializeAnalytics(): void {
  try {
    initializeGA4();
    setupWebVitalsTracking();
    setupErrorTracking();
    setupPerformanceMonitoring();
    console.log('Analytics initialized successfully');
  } catch (error) {
    console.error('Error initializing analytics:', error);
  }
}

// Type augmentation for window
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
