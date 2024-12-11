export class ConnectionTimeout {
  static readonly DEFAULT_TIMEOUTS = {
    connection: 5000,
    greeting: 5000,
    socket: 5000
  };

  static getTimeouts(customTimeouts = {}) {
    return {
      connectionTimeout: customTimeouts.connection || this.DEFAULT_TIMEOUTS.connection,
      greetingTimeout: customTimeouts.greeting || this.DEFAULT_TIMEOUTS.greeting,
      socketTimeout: customTimeouts.socket || this.DEFAULT_TIMEOUTS.socket
    };
  }
}