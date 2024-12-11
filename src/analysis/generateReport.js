import { ProjectAnalyzer } from './projectAnalyzer.js';
import { FeatureTracker } from './featureTracker.js';
import { ConfigurationAuditor } from './configurationAuditor.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';
import { table } from 'table';

async function generateAnalysisReport() {
  try {
    const analyzer = new ProjectAnalyzer();
    const featureTracker = new FeatureTracker();
    const configAuditor = new ConfigurationAuditor();

    // Analyze components
    await analyzer.analyzeComponent('API Server', 'operational', { endpoints: 2, middleware: 3 });
    await analyzer.analyzeComponent('Email Validator', 'operational', { methods: 4 });
    await analyzer.analyzeComponent('SMTP Verifier', 'operational', { servers: 'rotating' });

    // Track features
    const features = featureTracker.getFeatureDetails();
    for (const [name, details] of Object.entries(features)) {
      await analyzer.analyzeFeature(name, details.implemented, details.details);
    }

    // Audit configurations
    const configAudit = await configAuditor.auditConfigurations();
    for (const [name, details] of Object.entries(configAudit)) {
      await analyzer.analyzeConfiguration(name, 'audited', details);
    }

    // Generate final report
    const report = await analyzer.generateReport();
    const status = featureTracker.getImplementationStatus();

    // Display report
    console.log(chalk.bold.blue('\nProject Analysis Report'));
    console.log(chalk.bold('\nFeature Implementation Status:'));
    console.log(table([
      ['Total Features', 'Implemented', 'Pending', 'Completion'],
      [
        status.total,
        status.implemented,
        status.pending,
        `${status.completionPercentage.toFixed(1)}%`
      ]
    ]));

    logger.info('Analysis report generated successfully');
    return report;
  } catch (error) {
    logger.error('Error generating analysis report:', error);
    throw error;
  }
}

// Execute report generation
generateAnalysisReport().catch(console.error);