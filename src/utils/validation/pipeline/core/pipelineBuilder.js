import { ValidationPipeline } from './validationPipeline.js';
import { FormatStage } from '../stages/formatStage.js';
import { SyntaxStage } from '../stages/syntaxStage.js';
import { DomainStage } from '../stages/domainStage.js';
import { MxStage } from '../stages/mxStage.js';
import { StageUtils } from '../utils/stageUtils.js';

export class PipelineBuilder {
  constructor() {
    this.stages = [];
  }

  addStage(stage) {
    this.stages.push(stage);
    return this;
  }

  withFormat() {
    return this.addStage(new FormatStage());
  }

  withSyntax() {
    return this.addStage(new SyntaxStage());
  }

  withDomain() {
    return this.addStage(new DomainStage());
  }

  withMx() {
    return this.addStage(new MxStage());
  }

  build() {
    if (!StageUtils.validateStageOrder(this.stages)) {
      throw new Error('Invalid stage order');
    }

    const pipeline = new ValidationPipeline();
    this.stages.forEach(stage => pipeline.addStage(stage));
    return pipeline;
  }

  static createDefault() {
    return new PipelineBuilder()
      .withFormat()
      .withSyntax()
      .withDomain()
      .withMx()
      .build();
  }
}