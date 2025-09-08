import * as cheerio from 'cheerio';
import { AccessibilityResult } from './WordPressAnalyzer';

export class AccessibilityAnalyzer {
  async analyze($: cheerio.CheerioAPI): Promise<AccessibilityResult> {
    const missingAltImages = this.checkMissingAltText($);
    const headingIssues = this.checkHeadingHierarchy($);
    const missingAriaLabels = this.checkMissingAriaLabels($);
    
    const score = this.calculateAccessibilityScore(missingAltImages, headingIssues, missingAriaLabels);

    return {
      missingAltImages,
      headingIssues,
      missingAriaLabels,
      score
    };
  }

  private checkMissingAltText($: cheerio.CheerioAPI): number {
    let missingAltCount = 0;
    
    $('img').each((_, element) => {
      const $img = $(element);
      const alt = $img.attr('alt');
      const role = $img.attr('role');
      
      // Skip decorative images (role="presentation" or empty alt)
      if (role === 'presentation' || alt === '') {
        return;
      }
      
      // Count images without alt attribute or with meaningless alt text
      if (!alt || alt.trim() === '' || this.isMeaninglessAlt(alt)) {
        missingAltCount++;
      }
    });

    return missingAltCount;
  }

  private isMeaninglessAlt(alt: string): boolean {
    const meaninglessPatterns = [
      /^image$/i,
      /^img$/i,
      /^picture$/i,
      /^photo$/i,
      /^untitled$/i,
      /^dsc_?\d+$/i,
      /^img_?\d+$/i,
      /^\d+$/,
      /^click here$/i,
      /^read more$/i
    ];

    return meaninglessPatterns.some(pattern => pattern.test(alt.trim()));
  }

  private checkHeadingHierarchy($: cheerio.CheerioAPI): string[] {
    const issues: string[] = [];
    const headings: { level: number; text: string; index: number }[] = [];

    // Collect all headings
    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const tagName = element.tagName.toLowerCase();
      const level = parseInt(tagName.charAt(1));
      const text = $(element).text().trim();
      
      headings.push({ level, text, index });
    });

    if (headings.length === 0) {
      issues.push('No headings found on the page');
      return issues;
    }

    // Check for multiple H1s
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      issues.push('No H1 heading found');
    } else if (h1Count > 1) {
      issues.push(`Multiple H1 headings found (${h1Count})`);
    }

    // Check heading hierarchy
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      
      // Check if heading level jumps more than 1
      if (current.level > previous.level + 1) {
        issues.push(`Heading level jumps from H${previous.level} to H${current.level}`);
      }
    }

    // Check for empty headings
    headings.forEach((heading, index) => {
      if (!heading.text || heading.text.length === 0) {
        issues.push(`Empty H${heading.level} heading found`);
      }
    });

    return issues;
  }

  private checkMissingAriaLabels($: cheerio.CheerioAPI): number {
    let missingAriaCount = 0;

    // Check form inputs without labels
    $('input, textarea, select').each((_, element) => {
      const $element = $(element);
      const type = $element.attr('type');
      const id = $element.attr('id');
      const ariaLabel = $element.attr('aria-label');
      const ariaLabelledby = $element.attr('aria-labelledby');
      
      // Skip hidden inputs and buttons (they have different requirements)
      if (type === 'hidden' || type === 'submit' || type === 'button') {
        return;
      }

      // Check if element has proper labeling
      const hasLabel = id && $(`label[for="${id}"]`).length > 0;
      const hasAriaLabel = ariaLabel && ariaLabel.trim() !== '';
      const hasAriaLabelledby = ariaLabelledby && ariaLabelledby.trim() !== '';

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
        missingAriaCount++;
      }
    });

    // Check buttons without accessible names
    $('button').each((_, element) => {
      const $button = $(element);
      const ariaLabel = $button.attr('aria-label');
      const ariaLabelledby = $button.attr('aria-labelledby');
      const text = $button.text().trim();
      
      if (!text && !ariaLabel && !ariaLabelledby) {
        missingAriaCount++;
      }
    });

    // Check links without accessible names
    $('a').each((_, element) => {
      const $link = $(element);
      const ariaLabel = $link.attr('aria-label');
      const ariaLabelledby = $link.attr('aria-labelledby');
      const text = $link.text().trim();
      const title = $link.attr('title');
      
      if (!text && !ariaLabel && !ariaLabelledby && !title) {
        missingAriaCount++;
      }
    });

    return missingAriaCount;
  }

  private calculateAccessibilityScore(missingAltImages: number, headingIssues: string[], missingAriaLabels: number): number {
    let score = 100;

    // Deduct points for missing alt text (5 points per missing alt)
    score -= Math.min(missingAltImages * 5, 40);

    // Deduct points for heading issues (10 points per issue)
    score -= Math.min(headingIssues.length * 10, 30);

    // Deduct points for missing ARIA labels (3 points per missing label)
    score -= Math.min(missingAriaLabels * 3, 30);

    return Math.max(0, Math.min(100, score));
  }
}
