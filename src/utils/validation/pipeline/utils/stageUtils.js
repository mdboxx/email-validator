export class StageUtils {
  static getStageOrder() {
    return ['Format', 'Syntax', 'Domain', 'MX', 'SMTP'];
  }

  static validateStageOrder(stages) {
    const order = this.getStageOrder();
    const stageNames = stages.map(stage => stage.name);
    
    for (let i = 0; i < stageNames.length - 1; i++) {
      const currentIndex = order.indexOf(stageNames[i]);
      const nextIndex = order.indexOf(stageNames[i + 1]);
      
      if (currentIndex === -1 || nextIndex === -1 || currentIndex > nextIndex) {
        return false;
      }
    }
    
    return true;
  }

  static formatStageName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}