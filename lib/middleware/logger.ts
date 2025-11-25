interface LogLevel {
  INFO: 'info'
  WARN: 'warn'
  ERROR: 'error'
  DEBUG: 'debug'
}

const LOG_LEVELS: LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
}

interface LogEntry {
  level: string
  message: string
  timestamp: string
  data?: any
  requestId?: string
  userId?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logLevel = process.env.LOG_LEVEL || 'info'

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private formatLog(level: string, message: string, data?: any): LogEntry {
    const timestamp = new Date().toISOString()
    return {
      level,
      message,
      timestamp,
      ...(data && { data }),
      ...(process.env.NODE_ENV === 'production' && {
        service: 'gk-enterprise-suite',
        version: process.env.APP_VERSION || '1.0.0'
      })
    }
  }

  private output(logEntry: LogEntry): void {
    if (!this.shouldLog(logEntry.level)) return

    if (this.isDevelopment) {
      // Pretty console output for development
      const color = this.getLogColor(logEntry.level)
      console.log(
        `${color}[${logEntry.timestamp}] ${logEntry.level.toUpperCase()}: ${logEntry.message}\x1b[0m`,
        logEntry.data ? logEntry.data : ''
      )
    } else {
      // JSON output for production (ELK stack)
      console.log(JSON.stringify(logEntry))
    }
  }

  private getLogColor(level: string): string {
    const colors = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m',  // green
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m'  // red
    }
    return colors[level as keyof typeof colors] || '\x1b[0m'
  }

  public info(message: string, data?: any): void {
    this.output(this.formatLog(LOG_LEVELS.INFO, message, data))
  }

  public warn(message: string, data?: any): void {
    this.output(this.formatLog(LOG_LEVELS.WARN, message, data))
  }

  public error(message: string, data?: any): void {
    this.output(this.formatLog(LOG_LEVELS.ERROR, message, data))
  }

  public debug(message: string, data?: any): void {
    this.output(this.formatLog(LOG_LEVELS.DEBUG, message, data))
  }

  // API request logging
  public apiRequest(method: string, url: string, data?: any): void {
    this.info(`API Request: ${method} ${url}`, {
      method,
      url,
      ...(data && { data })
    })
  }

  // API response logging
  public apiResponse(method: string, url: string, statusCode: number, duration?: number): void {
    const level = statusCode >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO
    this.output(this.formatLog(
      level,
      `API Response: ${method} ${url} - ${statusCode}`,
      {
        method,
        url,
        statusCode,
        ...(duration && { duration: `${duration}ms` })
      }
    ))
  }

  // Database operation logging
  public dbOperation(operation: string, table: string, duration?: number): void {
    this.debug(`DB Operation: ${operation} on ${table}`, {
      operation,
      table,
      ...(duration && { duration: `${duration}ms` })
    })
  }

  // Authentication logging
  public auth(event: string, userId?: string, details?: any): void {
    this.info(`Auth: ${event}`, {
      event,
      ...(userId && { userId }),
      ...(details && { details })
    })
  }
}

export const logger = new Logger()