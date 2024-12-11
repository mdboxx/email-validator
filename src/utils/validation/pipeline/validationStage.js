export class ValidationStage {
  constructor(name, validator) {
    this.name = name;
    this.validator = validator;
    this.nextStage = null;
  }

  setNext(stage) {
    this.nextStage = stage;
    return stage;
  }

  async execute(email) {
    const result = await this.validator.validate(email);
    
    if (!result.isValid || !this.nextStage) {
      return result;
    }

    return this.nextStage.execute(email);
  }
}