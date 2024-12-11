export class ContextUtils {
  static createContext(email, options = {}) {
    return {
      email,
      options,
      startTime: Date.now(),
      results: new Map(),
      getElapsedTime() {
        return Date.now() - this.startTime;
      },
      addResult(stage, result) {
        this.results.set(stage, {
          ...result,
          duration: this.getElapsedTime(),
          timestamp: new Date().toISOString()
        });
      },
      getResults() {
        return Object.fromEntries(this.results);
      }
    };
  }

  static getStageResult(context, stageName) {
    return context.results.get(stageName);
  }

  static getAllResults(context) {
    return Array.from(context.results.entries()).map(([stage, result]) => ({
      stage,
      ...result
    }));
  }

  static getValidationSummary(context) {
    const results = this.getAllResults(context);
    return {
      success: results.every(r => r.isValid),
      stages: results.length,
      failedStages: results.filter(r => !r.isValid).length,
      duration: context.getElapsedTime(),
      timestamp: new Date().toISOString()
    };
  }
}