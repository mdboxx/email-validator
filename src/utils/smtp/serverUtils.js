export class ServerUtils {
  static generateServerId(host, port) {
    return `${host}:${port}`;
  }

  static parseServerId(serverId) {
    const [host, port] = serverId.split(':');
    return {
      host,
      port: parseInt(port, 10)
    };
  }

  static formatServerInfo(server) {
    return {
      id: server.id,
      host: server.host,
      port: server.port,
      secure: server.secure,
      addedAt: server.addedAt,
      lastUsed: server.lastUsed
    };
  }

  static calculateServerMetrics(server, history) {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    return {
      uptime: server.addedAt ? now - server.addedAt : 0,
      lastUsedAgo: server.lastUsed ? now - server.lastUsed : null,
      healthHistory: history.map(entry => ({
        status: entry.status,
        timestamp: entry.lastCheck
      })),
      dailyUsage: history.filter(entry => 
        entry.lastCheck > (now - dayInMs)
      ).length
    };
  }
}