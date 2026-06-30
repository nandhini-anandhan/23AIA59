import { Stack, Level, Package, LogSuccessResponse } from "./types";
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
export declare function configureLogger(userConfig: LoggerConfig): void;
/**
 * Log(stack, level, package, message)
 *
 * Reusable function that posts a structured log entry to the test server.
 * Safe to call from anywhere in the codebase (backend or frontend).
 * Failures to reach the logging server are swallowed (and optionally
 * mirrored to console) so that logging itself never crashes the app.
 */
export declare function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<LogSuccessResponse | null>;
