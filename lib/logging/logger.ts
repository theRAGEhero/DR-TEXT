/**
 * Simple Logger for Autonomous Debugging
 *
 * Features:
 * - Writes structured JSON to daily log files
 * - Shows colored output in console during development
 * - Request correlation with IDs
 * - Error serialization with stack traces
 * - Context chaining for better organization
 */

import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  timestamp: string
  name: string
  message: string
  context?: Record<string, any>
  error?: {
    message: string
    stack?: string
    cause?: any
  }
}

const config = {
  level: (process.env.LOG_LEVEL || 'debug') as LogLevel,
  dir: process.env.LOG_DIR || 'logs',
  toFile: process.env.LOG_TO_FILE !== 'false',
  isDev: process.env.NODE_ENV !== 'production'
}

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

class Logger {
  constructor(
    private name: string,
    private context: Record<string, any> = {}
  ) {}

  debug(message: string, meta?: Record<string, any>) {
    this.log('debug', message, meta)
  }

  info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta)
  }

  warn(message: string, meta?: Record<string, any>) {
    this.log('warn', message, meta)
  }

  error(message: string, meta?: Record<string, any>) {
    this.log('error', message, meta)
  }

  withContext(additionalContext: Record<string, any>): Logger {
    return new Logger(this.name, { ...this.context, ...additionalContext })
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>) {
    if (levelPriority[level] < levelPriority[config.level]) {
      return
    }

    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      name: this.name,
      message,
      context: { ...this.context, ...meta }
    }

    if (meta?.error) {
      entry.error = this.serializeError(meta.error)
      const { error, ...contextWithoutError } = entry.context!
      entry.context = contextWithoutError
    }

    this.writeConsole(entry)

    if (config.toFile) {
      this.writeFile(entry).catch(err => {
        console.error('Failed to write log to file:', err)
      })
    }
  }

  private serializeError(error: any): { message: string; stack?: string; cause?: any } {
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      }
    }
    return { message: String(error) }
  }

  private writeConsole(entry: LogEntry) {
    if (!config.isDev) {
      console.log(JSON.stringify(entry))
      return
    }

    const colors = {
      debug: '\x1b[36m',
      info: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m'
    }
    const reset = '\x1b[0m'
    const dim = '\x1b[2m'
    const bold = '\x1b[1m'

    const time = new Date(entry.timestamp).toLocaleTimeString()
    const color = colors[entry.level]
    const levelStr = entry.level.toUpperCase().padEnd(5)

    console.log(
      `${dim}[${time}]${reset} ${color}${levelStr}${reset} ${dim}[${entry.name}]${reset} ${bold}${entry.message}${reset}`
    )

    if (entry.context && Object.keys(entry.context).length > 0) {
      for (const [key, value] of Object.entries(entry.context)) {
        console.log(`  ${dim}${key}:${reset}`, value)
      }
    }

    if (entry.error) {
      console.log(`  ${dim}error:${reset}`, entry.error.message)
      if (entry.error.stack) {
        const stackLines = entry.error.stack.split('\n').slice(1, 5)
        stackLines.forEach(line => {
          console.log(`  ${dim}${line.trim()}${reset}`)
        })
      }
    }
  }

  private async writeFile(entry: LogEntry) {
    try {
      await fs.mkdir(config.dir, { recursive: true })

      const date = new Date().toISOString().split('T')[0]
      const logFile = path.join(config.dir, `app-${date}.log`)

      const line = JSON.stringify(entry) + '\n'
      await fs.appendFile(logFile, line, 'utf-8')
    } catch (error) {
      console.error('Failed to write to log file:', error)
    }
  }
}

export function getLogger(name: string): Logger {
  return new Logger(name)
}

export function createRequestId(): string {
  return randomUUID()
}

export type { LogLevel, LogEntry }
