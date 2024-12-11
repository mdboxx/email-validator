import { create } from 'zustand';

const useLogStore = create((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({ 
    logs: [log, ...state.logs].slice(0, 1000) // Keep last 1000 logs
  })),
  clearLogs: () => set({ logs: [] })
}));

class Logger {
  constructor() {
    this.level = 'debug';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg => {
      if (arg instanceof Error) {
        return arg.stack || arg.message;
      }
      if (typeof arg === 'object') {
        try {
          // Remove sensitive data
          const sanitized = { ...arg };
          delete sanitized.auth;
          delete sanitized.password;
          delete sanitized.pass;
          return JSON.stringify(sanitized, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    });

    return {
      timestamp,
      level,
      message: String(message),
      details: formattedArgs.join(' ')
    };
  }

  log(level, message, ...args) {
    if (!this.shouldLog(level)) return;

    const logData = this.formatMessage(level, message, ...args);
    
    // Add to store for real-time UI updates
    useLogStore.getState().addLog(logData);

    // Also log to console for development
    const consoleMethod = level === 'error' ? 'error' : 
                         level === 'warn' ? 'warn' : 
                         level === 'info' ? 'info' : 'log';
    
    console[consoleMethod](`[${logData.timestamp}] ${level.toUpperCase()}: ${message}`, ...args);
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  debug(message, ...args) {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();

export const useLogger = () => useLogStore((state) => ({
  logs: state.logs,
  clearLogs: state.clearLogs
}));