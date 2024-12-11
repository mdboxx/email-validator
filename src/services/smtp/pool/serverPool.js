import { EventEmitter } from 'events';
import { logger } from '../../../utils/logger.js';

export class ServerPool extends EventEmitter {
  constructor() {
    super();
    this.servers = new Map();
    this.currentIndex = 0;
  }

  addServer(server) {
    const serverId = `${server.host}:${server.port}`;
    this.servers.set(serverId, {
      ...server,
      id: serverId,
      addedAt: new Date().toISOString(),
      lastUsed: null
    });

    this.emit('serverAdded', serverId);
    return serverId;
  }

  removeServer(serverId) {
    const removed = this.servers.delete(serverId);
    if (removed) {
      this.emit('serverRemoved', serverId);
    }
    return removed;
  }

  getServer(serverId) {
    return this.servers.get(serverId);
  }

  getAllServers() {
    return Array.from(this.servers.values());
  }

  getNextServer() {
    const servers = this.getAllServers();
    if (servers.length === 0) {
      return null;
    }

    const server = servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % servers.length;
    
    if (server) {
      server.lastUsed = new Date().toISOString();
      this.servers.set(server.id, server);
    }

    return server;
  }

  getStats() {
    return {
      totalServers: this.servers.size,
      timestamp: new Date().toISOString()
    };
  }
}