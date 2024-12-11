import { ValidationPipeline } from '../core/validationPipeline.js';
import { SyntaxStage } from '../stages/syntaxStage.js';
import { DomainStage } from '../stages/domainStage.js';
import { MxStage } from '../stages/mxStage.js';
import { SmtpStage } from '../stages/smtpStage.js';

export class PipelineBuilder {
  constructor() {
    this.pipeline = new ValidationPipeline();
  }

  withSyntaxValidation() {
    this.pipeline.addStage(new SyntaxStage());
    return this;
  }

  withDomainValidation() {
    this.pipeline.addStage(new DomainStage());
    return this;
  }

  withMxValidation() {
    this.pipeline.addStage(new MxStage());
    return this;
  }

  withSmtpValidation() {
    this.pipeline.addStage(new SmtpStage());
    return this;
  }

  build() {
    return this.pipeline;
  }

  static createDefault() {
    return new PipelineBuilder()
      .withSyntaxValidation()
      .withDomainValidation()
      .withMxValidation()
      .withSmtpValidation()
      .build();
  }
}