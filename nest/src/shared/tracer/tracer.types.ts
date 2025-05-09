import { format } from 'winston'

export type LogContext =
  | string
  | Error
  | {
    tracerId?: string
    error?: Error
    [key: string]: unknown
  }

export type FormatedContext = {
  name: string
  message: string
  stack: string
  [key: string]: unknown
} | {
  name: string
} | {
  payload: string
}

export type Format = ReturnType<typeof format.timestamp>

export interface LogInfo {
  name?: string
  pid?: number
  traceInfo?: string
  msgPrefix?: string
  stack?: string
  payload?: string
  [key: string | symbol]: unknown
}

export interface ErrorContext {
  error: Error
  [key: string]: unknown
}
