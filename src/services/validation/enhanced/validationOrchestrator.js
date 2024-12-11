import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { RoleBasedValidator } from './roleBasedValidator.js';
import { CatchAllDetector } from './catchAllDetector.js';
import { TemporaryEmailDetector } from './temporaryEmailDetector.js';
import { SuggestionEngine } from './suggestionEngine.js';
import { MetricsCollector } from '../../metrics/core/metricsCollector.js';
import { logger } from '../../../utils/logger.js';

export class ValidationOrchestrator {
  constructor() {
    this.roleValidator = new RoleBasedValidator();
    this.catchAllDetector = new CatchAllDetector();
    this.temporaryDetector = new TemporaryEmailDetector();
    this.suggestionEngine = new SuggestionEngine();
    this.metrics = new MetricsCollector();
  }

  async validate(email) {
    const startTime = Date.now();
    try {
      // Step 1: Role-based validation
      const roleResult = await this.executeValidationStep(
        'role',
        () => this.roleValidator.validate(email)
      );
      if (!roleResult.isValid) return roleResult;

      // Step 2: Temporary email detection
      const temporaryResult = await this.executeValidationStep(
        'temporary',
        () => this.temporaryDetector.detect(email)
      );
      if (!temporaryResult.isValid) return temporaryResult;

      // Step 3: Catch-all detection
      const domain = email.split('@')[1];
      const catchAllResult = await this.executeValidationStep(
        'catchAll',
        () => this.catchAllDetector.detect(domain)
      );

      // Generate suggestions if any validation failed
      const suggestions = !catchAllResult.isValid ? 
        this.suggestionEngine.getSuggestions(email) : 
        [];

      const duration = Date.now() - startTime;
      
      return ValidationResult.success({
        email,
        validations: {
          role: roleResult.details,
          temporary: temporaryResult.details,
          catchAll: catchAllResult.details
        },
        suggestions,
        metadata: {
          duration,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Validation orchestration error:', error);
      const duration = Date.now() - startTime;
      this.metrics.recordValidation(false, duration);
      return ValidationResult.failure('Validation process failed');
    }
  }

  private async executeValidationStep(step, validationFn) {
    const stepStart = Date.now();
    try {
      const result = await validationFn();
      const duration = Date.now() - stepStart;
      this.metrics.recordStage(step, duration, result.isValid);
      return result;
    } catch (error) {
      logger.error(`${step} validation error:`, error);
      const duration = Date.now() - stepStart;
      this.metrics.recordStage(step, duration, false);
      throw error;
    }
  }

  getMetrics() {
    return this.metrics.getMetrics();
  }
}