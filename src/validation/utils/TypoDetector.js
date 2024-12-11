import { logger } from '../../utils/logger.js';

export class TypoDetector {
  constructor() {
    this.commonDomains = new Set([
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com'
    ]);
  }

  findTypos(localPart, domain) {
    const typos = [];

    // Check for common typos in local part
    if (this.hasRepeatedCharacters(localPart)) {
      typos.push('Repeated characters detected');
    }

    // Check for common domain typos
    const similarDomain = this.findSimilarDomain(domain);
    if (similarDomain) {
      typos.push(`Did you mean ${similarDomain}?`);
    }

    return typos;
  }

  getSuggestions(email) {
    try {
      const [localPart, domain] = email.split('@');
      const suggestions = [];

      // Check for similar domains
      const similarDomain = this.findSimilarDomain(domain);
      if (similarDomain) {
        suggestions.push(`${localPart}@${similarDomain}`);
      }

      // Check for common local part corrections
      const correctedLocal = this.correctLocalPart(localPart);
      if (correctedLocal !== localPart) {
        suggestions.push(`${correctedLocal}@${domain}`);
      }

      return suggestions;
    } catch (error) {
      logger.error('Error generating suggestions:', error);
      return [];
    }
  }

  private hasRepeatedCharacters(text) {
    return /(.)\1{2,}/.test(text);
  }

  private findSimilarDomain(domain) {
    const minDistance = 2;
    let closest = null;
    let minDist = Infinity;

    for (const commonDomain of this.commonDomains) {
      const distance = this.levenshteinDistance(domain, commonDomain);
      if (distance < minDist && distance <= minDistance) {
        minDist = distance;
        closest = commonDomain;
      }
    }

    return closest;
  }

  private correctLocalPart(localPart) {
    // Remove multiple consecutive dots
    return localPart.replace(/\.{2,}/g, '.');
  }

  private levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }
}