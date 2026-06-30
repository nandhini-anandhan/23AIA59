import {
  Stack,
  Level,
  Package,
  LogRequestBody,
  LogSuccessResponse,
  LogErrorResponse,
} from "./types";

/**
 * Configuration for the logging middleware.
 * Call `configureLogger` once at app startup (e.g. in your entrypoint)
 * before any `Log(...)` calls are made.
 */
export interface LoggerConfig {
  /** Base URL of the evaluation/test server, e.g. http://4.224.186.213 */
  baseUrl: string;
  /**
   * Auth token for the protected /evaluation-service/logs route.
   * Sent as `Authorization: Bearer <token>`.
   * NOTE: adjust this if the server expects a different auth scheme
   * (e.g. a raw header value, an API key header, etc).
   */
  authToken?: string;
  /** If true, also mirrors logs to console. Defaults to true. */
  mirrorToConsole?: boolean;
}

let config: LoggerConfig = {
  baseUrl: "http://4.224.186.213",
  mirrorToConsole: true,
};

export function configureLogger(userConfig: LoggerConfig): void {
  config = { ...config, ...userConfig };
}

const LOG_ENDPOINT = "/evaluation-service/logs";

/**
 * Log(stack, level, package, message)
 *
 * Reusable function that posts a structured log entry to the test server.
 * Safe to call from anywhere in the codebase (backend or frontend).
 * Failures to reach the logging server are swallowed (and optionally
 * mirrored to console) so that logging itself never crashes the app.
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogSuccessResponse | null> {
  const body: LogRequestBody = {
    stack,
    level,
    package: pkg,
    message,
  };

  if (config.mirrorToConsole !== false) {
    const consoleMethod =
      level === "error" || level === "fatal"
        ? console.error
        : level === "warn"
        ? console.warn
        : console.log;
    consoleMethod(`[${stack}:${pkg}] (${level}) ${message}`);
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.authToken) {
      headers["Authorization"] = `Bearer ${config.authToken}`;
    }

    const response = await fetch(`${config.baseUrl}${LOG_ENDPOINT}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData: LogErrorResponse = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      if (config.mirrorToConsole !== false) {
        console.error("Log API error:", response.status, errorData.message);
      }
      return null;
    }

    const data: LogSuccessResponse = await response.json();
    return data;
  } catch (err) {
    if (config.mirrorToConsole !== false) {
      console.error("Log API request failed:", err);
    }
    return null;
  }
}
