/**
 * Logger utility for consistent logging throughout the application
 * Provides different log levels and formatting
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    // Default log level based on environment
    this.logLevel = (import.meta.env.MODE === 'production' ? 'info' : 'debug') as LogLevel;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    return levels[level] >= levels[this.logLevel];
  }

  private formatMessage(level: string, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (context) {
      try {
        formatted += `\nContext: ${JSON.stringify(context, null, 2)}`;
      } catch (e) {
        formatted += `\n[Could not stringify context]`;
      }
    }
    
    return formatted;
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      const errorContext = {
        ...context,
        error: {
          name: error?.name,
          message: error?.message,
          stack: error?.stack
        }
      };
      console.error(this.formatMessage('error', message, errorContext));
    }
  }
}

export const logger = Logger.getInstance();
