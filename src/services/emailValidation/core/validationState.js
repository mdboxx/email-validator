export class ValidationState {
  constructor() {
    this.startTime = Date.now();
    this.stages = new Map();
    this.currentStage = null;
    this.errors = [];
  }

  startStage(stageName) {
    this.currentStage = {
      name: stageName,
      startTime: Date.now(),
      status: 'running'
    };
    this.stages.set(stageName, this.currentStage);
  }

  endStage(stageName, success, result) {
    const stage = this.stages.get(stageName);
    if (stage) {
      stage.endTime = Date.now();
      stage.duration = stage.endTime - stage.startTime;
      stage.status = success ? 'completed' : 'failed';
      stage.result = result;
    }
  }

  addError(error) {
    this.errors.push({
      message: error.message,
      stage: this.currentStage?.name,
      timestamp: new Date().toISOString()
    });
  }

  getMetrics() {
    return {
      totalDuration: Date.now() - this.startTime,
      stages: Array.from(this.stages.values()),
      errors: this.errors,
      timestamp: new Date().toISOString()
    };
  }
}