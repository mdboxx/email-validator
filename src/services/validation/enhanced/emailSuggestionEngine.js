import stringSimilarity from 'string-similarity';
import { logger } from '../../../utils/logger.js';

export class EmailSuggestionEngine {
  constructor() {
    this.commonDomains = new Set([
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com'
    ]);

    this.commonTypos = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmal.com', 'gamil.com'],
      'yahoo.com': ['yaho.com', 'yahooo.com', 'yhoo.com'],
      'hotmail.com': ['hotmai.com', 'hotmal.com', 'hotmial.com'],
      'outlook.com': ['outlok.com', 'outloo.com', 'outlookc.com']
    };
  }

  getSuggestions(email) {
    try {
      const [localPart, domain] = email.split('@');
      const suggestions = new Set();

      // Check for domain typos
      this.addDomainSuggestions(localPart, domain, suggestions);

      // Check for local part improvements
      this.addLocalPartSuggestions(localPart, domain, suggestions);

      return Array.from(suggestions).map(suggestion => ({
        value: suggestion,
        confidence: this.calculateConfidence(suggestion, email)
      }));
    } catch (error) {
      logger.error('Error generating suggestions:', error);
      return [];
    }
  }

  private addDomainSuggestions(localPart, domain, suggestions) {
    // Check exact typo matches
    for (const [correctDomain, typos] of Object.entries(this.commonTypos)) {
      if (typos.includes(domain)) {
        suggestions.add(`${localPart}@${correctDomain}`);
      }
    }

    // Find similar domains
    for (const commonDomain of this.commonDomains) {
      const similarity = stringSimilarity.compareTwoStrings(domain, commonDomain);
      if (similarity > 0.8) {
        suggestions.add(`${localPart}@${commonDomain}`);
      }
    }
  }

  private addLocalPartSuggestions(localPart, domain, suggestions) {
    // Remove consecutive dots
    const withoutDots = localPart.replace(/\.{2,}/g, '.');
    if (withoutDots !== localPart) {
      suggestions.add(`${withoutDots}@${domain}`);
    }

    // Fix common number substitutions
    const withoutNumbers = localPart.replace(/[0-9]/g, char => {
      const map = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's' };
      return map[char] || char;
    });
    if (withoutNumbers !== localPart) {
      suggestions.add(`${withoutNumbers}@${domain}`);
    }
  }

  private calculateConfidence(suggestion, original) {
    const [suggestedLocal, suggestedDomain] = suggestion.split('@');
    const [originalLocal, originalDomain] = original.split('@');

    const domainSimilarity = stringSimilarity.compareTwoStrings(
      suggestedDomain.toLowerCase(),
      originalDomain.toLowerCase()
    );

    const localPartSimilarity = stringSimilarity.compareTwoStrings(
      suggestedLocal.toLowerCase(),
      originalLocal.toLowerCase()
    );

    return (domainSimilarity + localPartSimilarity) / 2;
  }
}