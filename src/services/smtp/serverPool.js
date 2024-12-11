import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';

export class ServerPool extends EventEmitter {
  constructor() {
    super();
    this.servers = new Map();
    this.currentIndex = 0;
  }

  addServer(server) {
    const serverId = `${server.host}:${server.port}`;
    logger.info(`Adding SMTP server: ${serverId}`);
    
    this.servers.set(serverId, {
      ...server,
      id: serverId,
      addedAt: new Date().toISOString(),
      lastUsed: null,
      status: 'active'
    });

    this.emit('serverAdded', serverId);
    return serverId;
  }

  removeServer(serverId) {
    logger.info(`Removing SMTP server: ${serverId}`);
    const removed = this.servers.delete(serverId);
    if (removed) {
      this.emit('serverRemoved', serverId);
    }
    return removed;
  }

  async getNextAvailableServer() {
    const servers = Array.from(this.servers.values());
    if (servers.length === 0) {
      logger.warn('No SMTP servers available in pool');
      return null;
    }

    // Round-robin selection
    const server = servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % servers.length;
    
    if (server) {
      server.lastUsed = new Date().toISOString();
      this.servers.set(server.id, server);
      logger.info(`Selected SMTP server: ${server.id}`);
    }

    return server;
  }

  getServer(serverId) {
    return this.servers.get(serverId);
  }

  getAllServers() {
    return Array.from(this.servers.values());
  }

  getServerStatus(serverId) {
    const server = this.servers.get(serverId);
    if (!server) {
      return null;
    }

    return {
      id: server.id,
      host: server.host,
      port: server.port,
      secure: server.secure,
      status: server.status,
      addedAt: server.addedAt,
      lastUsed: server.lastUsed
    };
  }

  getAllServerStatuses() {
    return Array.from(this.servers.values()).map(server => ({
      id: server.id,
      host: server.host,
      port: server.port,
      secure: server.secure,
      status: server.status,
      addedAt: server.addedAt,
      lastUsed: server.lastUsed
    }));
  }
}