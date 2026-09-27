export type LogLevel = "debug" | "info" | "warn" | "error";

function write(level: LogLevel, message: string, data?: Record<string, unknown>): void {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...(data ? { data } : {})
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  debug: (message: string, data?: Record<string, unknown>) => write("debug", message, data),
  info: (message: string, data?: Record<string, unknown>) => write("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) => write("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) => write("error", message, data)
};
