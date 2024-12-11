import { Queue, Worker } from 'bullmq';
import { logger } from '../../utils/logger.js';
import { EmailValidationService } from '../emailValidation/index.js';

export class ValidationQueue {
  constructor() {
    this.queue = new Queue('email-validation', {
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }
    });

    this.worker = new Worker('email-validation', async job => {
      const validator = new EmailValidationService();
      return validator.validateEmail(job.data.email, job.data.options);
    }, {
      concurrency: 5
    });

    this.setupEventHandlers();
  }

  async addValidation(email, options = {}) {
    try {
      const job = await this.queue.add('validate', { email, options });
      logger.info(`Added validation job ${job.id} for ${email}`);
      return job;
    } catch (error) {
      logger.error('Error adding validation job:', error);
      throw error;
    }
  }

  private setupEventHandlers() {
    this.worker.on('completed', (job, result) => {
      logger.info(`Job ${job.id} completed`, { result });
    });

    this.worker.on('failed', (job, error) => {
      logger.error(`Job ${job.id} failed:`, error);
    });

    this.worker.on('error', error => {
      logger.error('Worker error:', error);
    });
  }

  async shutdown() {
    await this.queue.close();
    await this.worker.close();
  }
}