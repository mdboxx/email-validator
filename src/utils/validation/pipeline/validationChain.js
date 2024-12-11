import { ValidationResult } from '../validationResult.js';
import { logger } from '../../logger.js';

export class ValidationChain {
  constructor() {
    this.firstStage = null;
    this.lastStage = null;
  }

  addStage(stage) {
    if (!this.firstStage) {
      this.firstStage = stage;
      this.lastStage = stage;
    } else {
      this.lastStage.setNext(stage);
      this.lastStage = stage;
    }
    return this;
  }

  async execute(email) {
    try {
      if (!this.firstStage) {
        return ValidationResult.failure('No validation stages configured');
      }

      return this.firstStage.execute(email);
    } catch (error) {
      logger.error('Validation chain error:', error);
      return ValidationResult.failure('Validation chain failed');
    }
  }
}