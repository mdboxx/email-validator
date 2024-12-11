export class ResultFormatter {
  static format(results, options = {}) {
    return results.map(result => ({
      email: result.email,
      isValid: result.isValid,
      errors: result.errors.join('; '),
      syntaxValid: result.details?.syntax?.valid || false,
      domainValid: result.details?.domain?.valid || false,
      mxValid: result.details?.mx?.valid || false,
      smtpValid: result.details?.smtp?.valid || false,
      disposable: result.details?.disposable?.isDisposable || false,
      validationTime: result.metadata?.duration || 0,
      timestamp: result.timestamp,
      ...ResultFormatter.getCustomFields(result, options.includeFields || [])
    }));
  }

  static getCustomFields(result, fields) {
    const customFields = {};
    fields.forEach(field => {
      const value = ResultFormatter.getNestedValue(result, field);
      if (value !== undefined) {
        customFields[field] = value;
      }
    });
    return customFields;
  }

  static getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => 
      current ? current[key] : undefined, obj);
  }
}