import * as cheerio from 'cheerio';
import { GDPRResult, Tracker } from './WordPressAnalyzer';

export class GDPRAnalyzer {
  private trackerPatterns = {
    'Google Analytics': {
      type: 'analytics' as const,
      patterns: [
        /gtag\(/,
        /ga\(/,
        /google-analytics\.com/,
        /googletagmanager\.com/,
        /UA-\d+-\d+/,
        /G-[A-Z0-9]+/
      ]
    },
    'Meta Pixel': {
      type: 'advertising' as const,
      patterns: [
        /fbq\(/,
        /facebook\.net/,
        /connect\.facebook\.net/,
        /_fbp/,
        /fbevents\.js/
      ]
    },
    'Google Tag Manager': {
      type: 'analytics' as const,
      patterns: [
        /googletagmanager\.com/,
        /GTM-[A-Z0-9]+/
      ]
    },
    'LinkedIn Insight': {
      type: 'advertising' as const,
      patterns: [
        /snap\.licdn\.com/,
        /_linkedin_partner_id/
      ]
    },
    'Twitter Pixel': {
      type: 'advertising' as const,
      patterns: [
        /static\.ads-twitter\.com/,
        /twq\(/
      ]
    },
    'Hotjar': {
      type: 'analytics' as const,
      patterns: [
        /static\.hotjar\.com/,
        /hj\(/
      ]
    }
  };

  async analyze($: cheerio.CheerioAPI, url: string): Promise<GDPRResult> {
    const hasCookieBanner = this.detectCookieBanner($);
    const hasPrivacyPolicy = this.detectPrivacyPolicy($);
    const trackers = this.detectTrackers($);
    
    const score = this.calculateGDPRScore(hasCookieBanner, hasPrivacyPolicy, trackers);

    return {
      hasCookieBanner,
      hasPrivacyPolicy,
      trackers,
      score
    };
  }

  private detectCookieBanner($: cheerio.CheerioAPI): boolean {
    const cookieBannerIndicators = [
      // Common cookie banner selectors
      $('#cookie-banner, #cookie-notice, #cookie-consent').length > 0,
      $('.cookie-banner, .cookie-notice, .cookie-consent').length > 0,
      $('[id*="cookie"], [class*="cookie"]').length > 0,
      
      // Text-based detection
      $('*:contains("cookie")').filter((_, el) => {
        const text = $(el).text().toLowerCase();
        return text.includes('accept') || text.includes('consent') || text.includes('privacy');
      }).length > 0,
      
      // GDPR-specific terms
      $('*:contains("GDPR"), *:contains("privacy policy")').length > 0,
      
      // Common cookie consent libraries
      $('script[src*="cookiebot"], script[src*="onetrust"], script[src*="cookiepro"]').length > 0
    ];

    return cookieBannerIndicators.some(indicator => indicator);
  }

  private detectPrivacyPolicy($: cheerio.CheerioAPI): boolean {
    const privacyPolicyIndicators = [
      // Direct links to privacy policy
      $('a[href*="privacy"]').length > 0,
      $('a[href*="datenschutz"]').length > 0, // German
      $('a[href*="politique-confidentialite"]').length > 0, // French
      
      // Text-based detection
      $('a:contains("Privacy Policy")').length > 0,
      $('a:contains("Privacy")').length > 0,
      $('a:contains("Datenschutz")').length > 0,
      $('a:contains("Politique de confidentialité")').length > 0,
      
      // Footer links (common location)
      $('footer a[href*="privacy"], footer a:contains("Privacy")').length > 0
    ];

    return privacyPolicyIndicators.some(indicator => indicator);
  }

  private detectTrackers($: cheerio.CheerioAPI): Tracker[] {
    const trackers: Tracker[] = [];
    const pageContent = $.html();

    Object.entries(this.trackerPatterns).forEach(([name, config]) => {
      const detected = config.patterns.some(pattern => pattern.test(pageContent));
      
      trackers.push({
        name,
        type: config.type,
        detected
      });
    });

    return trackers;
  }

  private calculateGDPRScore(hasCookieBanner: boolean, hasPrivacyPolicy: boolean, trackers: Tracker[]): number {
    let score = 100;

    // Deduct points for missing cookie banner
    if (!hasCookieBanner) {
      score -= 40;
    }

    // Deduct points for missing privacy policy
    if (!hasPrivacyPolicy) {
      score -= 40;
    }

    // Deduct points for trackers without proper consent mechanism
    const detectedTrackers = trackers.filter(t => t.detected);
    if (detectedTrackers.length > 0 && !hasCookieBanner) {
      score -= 20; // Additional penalty for trackers without consent
    }

    return Math.max(0, Math.min(100, score));
  }
}
