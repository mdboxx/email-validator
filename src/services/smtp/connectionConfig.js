export class ConnectionConfig {
  static create(server) {
    return {
      host: server.host,
      port: server.port,
      secure: server.secure,
      auth: server.auth,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    };
  }

  static validate(config) {
    return (
      config &&
      typeof config.host === 'string' &&
      typeof config.port === 'number' &&
      typeof config.secure === 'boolean' &&
      (!config.auth || (
        typeof config.auth.user === 'string' &&
        typeof config.auth.pass === 'string'
      ))
    );
  }
}