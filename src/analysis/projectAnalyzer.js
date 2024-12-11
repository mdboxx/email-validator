import { fileHandler } from '../utils/fileHandler.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import { createPath } from '../utils/pathUtils.js';

export class ProjectAnalyzer {
  constructor() {
    this.components = new Map();
    this.features = new Map();
    this.configurations = new Map();
  }

  async analyzeComponent(name, status, details) {
    this.components.set(name, { status, details, timestamp: new Date() });
    await this.logAnalysis('component', name, status, details);
  }

  async analyzeFeature(name, implementation, pending) {
    this.features.set(name, {
      implementation,
      pending,
      timestamp: new Date()
    });
    await this.logAnalysis('feature', name, 'analyzed', { implementation, pending });
  }

  async analyzeConfiguration(name, status, details) {
    this.configurations.set(name, { status, details, timestamp: new Date() });
    await this.logAnalysis('configuration', name, status, details);
  }

  async logAnalysis(type, name, status, details) {
    const logEntry = {
      type,
      name,
      status,
      details,
      timestamp: new Date().toISOString()
    };

    const logPath = createPath(config.logDir, 'project_analysis.log');
    const logContent = JSON.stringify(logEntry) + '\n';
    
    await fileHandler.appendToFile(logPath, logContent);
    logger.info(`Analysis logged for ${type}: ${name}`);
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      components: Object.fromEntries(this.components),
      features: Object.fromEntries(this.features),
      configurations: Object.fromEntries(this.configurations),
      summary: {
        totalComponents: this.components.size,
        totalFeatures: this.features.size,
        totalConfigurations: this.configurations.size
      }
    };

    const reportPath = createPath(config.logDir, 'project_status.json');
    await fileHandler.writeFile(reportPath, JSON.stringify(report, null, 2));
    return report;
  }
}