export class ConnectionConfig {
  static readonly DEFAULT_TIMEOUTS = {
    connection: 5000,
    greeting: 5000,
    socket: 5000
  };

  validate(config) {
    if (!this.isValidConfig(config)) {
      throw new Error('Invalid SMTP server configuration');
    }

    return {
      host: config.host,
      port: config.port,
      secure: config.secure ?? false,
      auth: config.auth,
      connectionTimeout: config.timeout?.connection || ConnectionConfig.DEFAULT_TIMEOUTS.connection,
      greetingTimeout: config.timeout?.greeting || ConnectionConfig.DEFAULT_TIMEOUTS.greeting,
      socketTimeout: config.timeout?.socket || ConnectionConfig.DEFAULT_TIMEOUTS.socket
    };
  }

  private isValidConfig(config) {
    return (
      config &&
      typeof config.host === 'string' &&
      typeof config.port === 'number' &&
      (!config.auth || (
        typeof config.auth.user === 'string' &&
        typeof config.auth.pass === 'string'
      ))
    );
  }
}