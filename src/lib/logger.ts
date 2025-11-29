/**
 * Structured Client-Side Logger
 * Provides consistent logging with context for production observability
 */

export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

interface LogContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  private createLogContext(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
  ): LogContext {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
  }

  private formatLog(logContext: LogContext): string {
    const { timestamp, level, message, context, error } = logContext;

    let formatted = `[${timestamp}] [${level}] ${message}`;

    if (context) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }

    if (error) {
      formatted += `\nError: ${error.message}`;
      if (error.stack) {
        formatted += `\nStack: ${error.stack}`;
      }
    }

    return formatted;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log ERROR level
    if (!this.isDevelopment && level !== LogLevel.ERROR) {
      return false;
    }
    return true;
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const logContext = this.createLogContext(
      LogLevel.ERROR,
      message,
      context,
      error,
    );

    if (this.isDevelopment) {
      console.error(this.formatLog(logContext));
    } else {
      // In production, send to external service or store locally
      console.error(JSON.stringify(logContext));

      // Future: Send to error tracking service (e.g., Sentry, LogRocket)
      // this.sendToErrorTracking(logContext);
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const logContext = this.createLogContext(LogLevel.WARN, message, context);

    if (this.isDevelopment) {
      console.warn(this.formatLog(logContext));
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const logContext = this.createLogContext(LogLevel.INFO, message, context);

    if (this.isDevelopment) {
      console.info(this.formatLog(logContext));
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const logContext = this.createLogContext(LogLevel.DEBUG, message, context);

    if (this.isDevelopment) {
      console.debug(this.formatLog(logContext));
    }
  }

  // Track custom events for analytics
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (this.isDevelopment) {
      console.log(`[EVENT] ${eventName}`, properties);
    }

    // Future: Send to analytics service
    // this.sendToAnalytics(eventName, properties);
  }
}

// Export singleton instance
export const logger = new Logger();
