import { fileHandler } from '../../../utils/fileHandler.js';
import { createPath } from '../../../utils/pathUtils.js';
import { config } from '../../../config/index.js';

export class JsonMetricsReporter {
  static async report(metrics) {
    const report = {
      ...metrics,
      generatedAt: new Date().toISOString()
    };

    const reportPath = createPath(config.logDir, 'metrics', `report-${Date.now()}.json`);
    await fileHandler.writeFile(reportPath, JSON.stringify(report, null, 2));
    return reportPath;
  }
}