import { ValidationService } from './core/ValidationService.js';
import { ValidationQueue } from '../queue/validationQueue.js';
import { logger } from '../../utils/logger.js';

export class ValidationAPI {
  constructor() {
    this.service = new ValidationService();
    this.queue = new ValidationQueue();
  }

  async validateEmail(email, options = {}) {
    try {
      if (options.async) {
        const job = await this.queue.addValidation(email, options);
        return {
          jobId: job.id,
          status: 'queued',
          timestamp: new Date().toISOString()
        };
      }

      return await this.service.validate(email, options);
    } catch (error) {
      logger.error('Validation API error:', error);
      throw error;
    }
  }

  async getJobStatus(jobId) {
    try {
      const job = await this.queue.queue.getJob(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      return {
        id: job.id,
        status: await job.getState(),
        result: job.returnvalue,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Job status error:', error);
      throw error;
    }
  }
}