export class ServerRotation {
  constructor() {
    this.currentIndex = 0;
    this.lastRotationTime = Date.now();
  }

  getNextIndex(totalServers) {
    if (totalServers <= 0) {
      return -1;
    }

    const index = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % totalServers;
    this.lastRotationTime = Date.now();

    return index;
  }

  getRotationStatus() {
    return {
      currentIndex: this.currentIndex,
      lastRotationTime: this.lastRotationTime,
      rotationCount: this.currentIndex
    };
  }

  reset() {
    this.currentIndex = 0;
    this.lastRotationTime = Date.now();
  }
}