import Benchmark from 'benchmark';
import { EmailValidationService } from '../../services/emailValidation/service.js';

const validator = new EmailValidationService();
const suite = new Benchmark.Suite;

// Test data
const validEmail = 'test@example.com';
const invalidEmail = 'invalid-email';
const disposableEmail = 'test@tempmail.com';
const roleBasedEmail = 'admin@example.com';

suite
  .add('Syntax Validation', {
    defer: true,
    fn: async (deferred) => {
      await validator.validateEmail(validEmail, { skipDns: true, skipSmtp: true });
      deferred.resolve();
    }
  })
  .add('Complete Validation', {
    defer: true,
    fn: async (deferred) => {
      await validator.validateEmail(validEmail);
      deferred.resolve();
    }
  })
  .add('Cached Validation', {
    defer: true,
    fn: async (deferred) => {
      await validator.validateEmail(validEmail);
      deferred.resolve();
    }
  })
  .add('Bulk Validation (10 emails)', {
    defer: true,
    fn: async (deferred) => {
      await validator.validateBulk(Array(10).fill(validEmail));
      deferred.resolve();
    }
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ 'async': true });