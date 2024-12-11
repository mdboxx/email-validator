import chalk from 'chalk';

export class ConsoleMetricsReporter {
  static report(metrics) {
    console.log(chalk.blue('\nValidation Metrics Report'));
    console.log(chalk.gray('─'.repeat(50)));

    console.log(chalk.yellow('\nValidations:'));
    console.log(`Total: ${metrics.validations.total}`);
    console.log(`Successful: ${metrics.validations.successful}`);
    console.log(`Failed: ${metrics.validations.failed}`);
    console.log(`Success Rate: ${metrics.successRate.toFixed(2)}%`);

    console.log(chalk.yellow('\nErrors:'));
    console.log(`Syntax: ${metrics.errors.syntax}`);
    console.log(`Domain: ${metrics.errors.domain}`);
    console.log(`MX: ${metrics.errors.mx}`);
    console.log(`SMTP: ${metrics.errors.smtp}`);

    console.log(chalk.yellow('\nPerformance:'));
    console.log(`Average Response Time: ${metrics.performance.averageResponseTime.toFixed(2)}ms`);

    console.log(chalk.gray('\n─'.repeat(50)));
  }
}