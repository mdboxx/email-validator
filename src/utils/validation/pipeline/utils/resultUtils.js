export class ResultUtils {
  static mergeResults(results) {
    const merged = {
      isValid: true,
      errors: [],
      details: {},
      stages: []
    };

    for (const [stageName, result] of Object.entries(results)) {
      merged.isValid = merged.isValid && result.isValid;
      if (!result.isValid) {
        merged.errors.push(...result.errors.map(error => `[${stageName}] ${error}`));
      }
      merged.details[stageName.toLowerCase()] = result.details;
      merged.stages.push({
        name: stageName,
        success: result.isValid,
        timestamp: result.timestamp
      });
    }

    return merged;
  }

  static formatValidationError(error, stage) {
    return {
      message: error,
      stage,
      timestamp: new Date().toISOString()
    };
  }

  static isTransientError(error) {
    const transientErrors = [
      'ETIMEDOUT',
      'ECONNREFUSED',
      'ENOTFOUND'
    ];
    return transientErrors.includes(error.code);
  }
}