import * as cheerio from 'cheerio';
import { SecurityResult, Vulnerability, Plugin, Theme } from './WordPressAnalyzer';

export class SecurityAnalyzer {
  private knownVulnerabilities: { [key: string]: Vulnerability[] } = {
    // WordPress core vulnerabilities (simplified dataset)
    '6.0': [
      {
        component: 'WordPress Core',
        version: '6.0',
        severity: 'high',
        description: 'Multiple vulnerabilities in WordPress 6.0'
      }
    ],
    '5.9': [
      {
        component: 'WordPress Core',
        version: '5.9',
        severity: 'critical',
        description: 'Critical security vulnerabilities in WordPress 5.9'
      }
    ]
  };

  async analyze($: cheerio.CheerioAPI, url: string): Promise<SecurityResult> {
    const wpDetection = this.detectWordPress($);
    const wordpressVersion = this.detectWordPressVersion($);
    const plugins = this.detectPlugins($);
    const themes = this.detectThemes($);
    const vulnerabilities = this.checkVulnerabilities(wordpressVersion, plugins, themes);
    
    const score = this.calculateSecurityScore(wpDetection.isWordPress, vulnerabilities, wordpressVersion, wpDetection.isHardened);

    return {
      isWordPress: wpDetection.isWordPress,
      detectionMethod: wpDetection.detectionMethod,
      isHardened: wpDetection.isHardened,
      wordpressVersion,
      plugins,
      themes,
      vulnerabilities,
      score
    };
  }

  private detectWordPress($: cheerio.CheerioAPI): { isWordPress: boolean; detectionMethod: string; isHardened: boolean } {
    const detectionMethods: { method: string; detected: boolean; isObvious: boolean }[] = [
      // Obvious indicators (security risk if present)
      { method: 'wp-content paths', detected: $('link[href*="wp-content"], script[src*="wp-content"]').length > 0, isObvious: true },
      { method: 'wp-includes paths', detected: $('script[src*="wp-includes"], link[href*="wp-includes"]').length > 0, isObvious: true },
      { method: 'wp-admin paths', detected: $('link[href*="wp-admin"], script[src*="wp-admin"]').length > 0, isObvious: true },
      
      // Less obvious but still revealing
      { method: 'meta generator', detected: $('meta[name="generator"]').attr('content')?.includes('WordPress') || false, isObvious: true },
      { method: 'admin bar', detected: $('#wpadminbar').length > 0, isObvious: true },
      
      // Subtle indicators (better security)
      { method: 'body classes', detected: $('body').hasClass('wordpress') || $('body').attr('class')?.includes('wp-') || false, isObvious: false },
      { method: 'pingback link', detected: $('link[rel="pingback"]').length > 0, isObvious: false },
      { method: 'REST API', detected: $('link[rel="https://api.w.org/"]').length > 0, isObvious: false },
      { method: 'RSD link', detected: $('link[rel="EditURI"]').attr('href')?.includes('xmlrpc.php') || false, isObvious: false },
      { method: 'shortlink', detected: $('link[rel="shortlink"]').length > 0, isObvious: false },
      
      // Advanced detection methods
      { method: 'WordPress comments', detected: $('<!--').toString().includes('WordPress') || $('<!--').toString().includes('wp-'), isObvious: false },
      { method: 'theme patterns', detected: $('link[id*="style"], link[id*="theme"]').length > 0, isObvious: false },
      { method: 'WordPress scripts', detected: $('script').toString().includes('wp_') || $('script').toString().includes('wordpress'), isObvious: false },
      { method: 'login form action', detected: $('form[action*="wp-login"]').length > 0, isObvious: true }
    ];

    const detectedMethods = detectionMethods.filter(d => d.detected);
    const obviousDetections = detectedMethods.filter(d => d.isObvious);
    const subtleDetections = detectedMethods.filter(d => !d.isObvious);

    const isWordPress = detectedMethods.length > 0;
    const isHardened = isWordPress && obviousDetections.length === 0 && subtleDetections.length > 0;
    
    let detectionMethod = 'Not detected';
    if (isWordPress) {
      if (isHardened) {
        detectionMethod = `Hardened WordPress (detected via: ${subtleDetections.map(d => d.method).join(', ')})`;
      } else {
        detectionMethod = `Standard WordPress (detected via: ${detectedMethods.map(d => d.method).join(', ')})`;
      }
    }

    return { isWordPress, detectionMethod, isHardened };
  }

  private detectWordPressVersion($: cheerio.CheerioAPI): string | undefined {
    // Try to get version from meta generator
    const generator = $('meta[name="generator"]').attr('content');
    if (generator && generator.includes('WordPress')) {
      const versionMatch = generator.match(/WordPress\s+([\d.]+)/);
      if (versionMatch) {
        return versionMatch[1];
      }
    }

    // Try to get version from wp-includes scripts/styles
    const scripts = $('script[src*="wp-includes"], link[href*="wp-includes"]');
    for (let i = 0; i < scripts.length; i++) {
      const src = $(scripts[i]).attr('src') || $(scripts[i]).attr('href');
      if (src) {
        const versionMatch = src.match(/ver=([\d.]+)/);
        if (versionMatch) {
          return versionMatch[1];
        }
      }
    }

    return undefined;
  }

  private detectPlugins($: cheerio.CheerioAPI): Plugin[] {
    const plugins: Plugin[] = [];
    const pluginPaths = new Set<string>();

    // Look for plugin assets in wp-content/plugins/
    $('script[src*="wp-content/plugins/"], link[href*="wp-content/plugins/"]').each((_, element) => {
      const src = $(element).attr('src') || $(element).attr('href');
      if (src) {
        const match = src.match(/wp-content\/plugins\/([^\/]+)/);
        if (match) {
          pluginPaths.add(match[1]);
        }
      }
    });

    // Convert to plugin objects
    pluginPaths.forEach(slug => {
      plugins.push({
        name: this.slugToName(slug),
        slug,
        version: undefined // Version detection would require more sophisticated analysis
      });
    });

    return plugins;
  }

  private detectThemes($: cheerio.CheerioAPI): Theme[] {
    const themes: Theme[] = [];
    const themePaths = new Set<string>();

    // Look for theme assets in wp-content/themes/
    $('script[src*="wp-content/themes/"], link[href*="wp-content/themes/"]').each((_, element) => {
      const src = $(element).attr('src') || $(element).attr('href');
      if (src) {
        const match = src.match(/wp-content\/themes\/([^\/]+)/);
        if (match) {
          themePaths.add(match[1]);
        }
      }
    });

    // Convert to theme objects
    themePaths.forEach(slug => {
      themes.push({
        name: this.slugToName(slug),
        slug,
        version: undefined
      });
    });

    return themes;
  }

  private checkVulnerabilities(version?: string, plugins: Plugin[] = [], themes: Theme[] = []): Vulnerability[] {
    const vulnerabilities: Vulnerability[] = [];

    // Check WordPress core vulnerabilities
    if (version && this.knownVulnerabilities[version]) {
      vulnerabilities.push(...this.knownVulnerabilities[version]);
    }

    // Check for outdated WordPress versions
    if (version) {
      const versionNumber = parseFloat(version);
      if (versionNumber < 6.4) {
        vulnerabilities.push({
          component: 'WordPress Core',
          version,
          severity: 'high',
          description: 'WordPress version is outdated and may contain security vulnerabilities'
        });
      }
    }

    // In a real implementation, you would check plugins and themes against vulnerability databases
    // For now, we'll add some example checks
    plugins.forEach(plugin => {
      if (plugin.slug === 'old-vulnerable-plugin') {
        vulnerabilities.push({
          component: plugin.name,
          version: plugin.version,
          severity: 'critical',
          description: 'Known vulnerable plugin detected'
        });
      }
    });

    return vulnerabilities;
  }

  private calculateSecurityScore(isWordPress: boolean, vulnerabilities: Vulnerability[], version?: string, isHardened?: boolean): number {
    if (!isWordPress) {
      return 50; // Neutral score if not WordPress
    }

    let score = 100;

    // Add bonus points for hardened WordPress (security best practice)
    if (isHardened) {
      score += 15; // Bonus for hiding obvious WordPress indicators
    }

    // Deduct points for vulnerabilities
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          score -= 30;
          break;
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    // Deduct points for missing version info (but less if hardened)
    if (!version) {
      score -= isHardened ? 5 : 10; // Less penalty if hardened
    }

    return Math.max(0, Math.min(100, score));
  }

  private slugToName(slug: string): string {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
