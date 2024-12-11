import { ValidationChain } from '../validationChain.js';
import { SyntaxStage } from '../stages/syntaxStage.js';
import { DomainStage } from '../stages/domainStage.js';
import { MxStage } from '../stages/mxStage.js';

export class ValidationPipelineBuilder {
  constructor() {
    this.chain = new ValidationChain();
  }

  withSyntaxValidation() {
    this.chain.addStage(new SyntaxStage());
    return this;
  }

  withDomainValidation() {
    this.chain.addStage(new DomainStage());
    return this;
  }

  withMxValidation() {
    this.chain.addStage(new MxStage());
    return this;
  }

  build() {
    return this.chain;
  }

  static createDefault() {
    return new ValidationPipelineBuilder()
      .withSyntaxValidation()
      .withDomainValidation()
      .withMxValidation()
      .build();
  }
}