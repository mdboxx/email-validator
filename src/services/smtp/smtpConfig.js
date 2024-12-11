import { ConnectionConfig } from './connectionConfig.js';
import { ServerRotation } from './serverRotation.js';
import { ServerValidator } from './serverValidator.js';

export class SmtpConfigManager {
  constructor() {
    this.servers = [];
    this.rotation = new ServerRotation();
  }

  addServer(config) {
    if (!ConnectionConfig.validate(config)) {
      throw new Error('Invalid SMTP server configuration');
    }
    this.servers.push({
      ...config,
      failureCount: 0,
      lastUsed: 0
    });
  }

  getNextServer() {
    if (this.servers.length === 0) {
      return null;
    }

    const startIndex = this.rotation.getNextIndex(this.servers.length);
    let currentIndex = startIndex;

    do {
      const server = this.servers[currentIndex];
      if (ServerValidator.isAvailable(server)) {
        server.lastUsed = Date.now();
        return server;
      }
      currentIndex = (currentIndex + 1) % this.servers.length;
    } while (currentIndex !== startIndex);

    return null;
  }

  markServerFailed(server) {
    const serverConfig = this.servers.find(s => 
      s.host === server.host && s.port === server.port
    );
    if (serverConfig) {
      serverConfig.failureCount++;
      serverConfig.lastFailure = Date.now();
    }
  }
}