export class FormatDetector {
  static detect(content) {
    if (FormatDetector.isCsv(content)) {
      return 'csv';
    }
    return 'text';
  }

  static isCsv(content) {
    return content.includes(',') && content.includes('\n');
  }
}