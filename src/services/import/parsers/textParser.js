export class TextParser {
  static parse(content) {
    return content
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
  }
}