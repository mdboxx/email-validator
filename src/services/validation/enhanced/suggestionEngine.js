import stringSimilarity from 'string-similarity';
import { logger } from '../../../utils/logger.js';

export class SuggestionEngine {
  constructor() {
    this.commonDomains = new Set([
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com',
      'protonmail.com',
      'mail.com',
      'zoho.com',
      'yandex.com'
    ]);

    this.commonTypos = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmal.com', 'gamil.com', 'gmailc.om'],
      'yahoo.com': ['yaho.com', 'yahooo.com', 'yaaho.com', 'yhoo.com', 'yahhoo.com'],
      'hotmail.com': ['hotmai.com', 'hotmal.com', 'hotmial.com', 'hotamail.com', 'hotnail.com'],
      'outlook.com': ['outlok.com', 'outloo.com', 'outlookc.com', 'outlock.com', 'outlok.com']
    };

    this.commonLocalPartFixes = {
      removeConsecutiveDots: (text) => text.replace(/\.{2,}/g, '.'),
      fixCommonSwaps: (text) => text.replace(/[1405]/g, c => ({ '1': 'i', '4': 'a', '0': 'o', '5': 's' })[c]),
      removeUnintendedSpaces: (text) => text.replace(/\s+/g, ''),
      fixCommonMisspellings: (text) => {
        const fixes = {
          'info': ['inf0', 'inf'],
          'admin': ['adm1n', 'admn'],
          'support': ['suport', 'supprt'],
          'contact': ['contct', 'kontact']
        };
        for (const [correct, wrongs] of Object.entries(fixes)) {
          if (wrongs.includes(text)) return correct;
        }
        return text;
      }
    };
  }

  getSuggestions(email) {
    try {
      const [localPart, domain] = email.split('@');
      const suggestions = new Set();

      // Domain suggestions
      this.addDomainSuggestions(localPart, domain, suggestions);

      // Local part suggestions
      this.addLocalPartSuggestions(localPart, domain, suggestions);

      // Combined fixes
      this.addCombinedSuggestions(localPart, domain, suggestions);

      return Array.from(suggestions);
    } catch (error) {
      logger.error('Error generating suggestions:', error);
      return [];
    }
  }

  private addDomainSuggestions(localPart, domain, suggestions) {
    // Check for exact typo matches
    if (this.commonTypos[domain]) {
      suggestions.add(`${localPart}@${domain}`);
    }

    // Find similar domains
    const similarDomains = this.findSimilarDomains(domain);
    for (const similarDomain of similarDomains) {
      suggestions.add(`${localPart}@${similarDomain}`);
    }
  }

  private addLocalPartSuggestions(localPart, domain, suggestions) {
    let corrected = localPart;
    for (const [_, fix] of Object.entries(this.commonLocalPartFixes)) {
      const fixed = fix(corrected);
      if (fixed !== corrected) {
        suggestions.add(`${fixed}@${domain}`);
        corrected = fixed;
      }
    }
  }

  private addCombinedSuggestions(localPart, domain, suggestions) {
    // Apply both domain and local part fixes
    const correctedLocal = Object.values(this.commonLocalPartFixes)
      .reduce((text, fix) => fix(text), localPart);
    
    const similarDomains = this.findSimilarDomains(domain);
    for (const similarDomain of similarDomains) {
      if (correctedLocal !== localPart) {
        suggestions.add(`${correctedLocal}@${similarDomain}`);
      }
    }
  }

  private findSimilarDomains(domain, threshold = 0.8) {
    const similarDomains = [];
    for (const commonDomain of this.commonDomains) {
      const similarity = stringSimilarity.compareTwoStrings(domain.toLowerCase(), commonDomain);
      if (similarity >= threshold) {
        similarDomains.push(commonDomain);
      }
    }
    return similarDomains;
  }

  getConfidence(suggestion, original) {
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