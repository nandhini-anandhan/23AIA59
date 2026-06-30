export type Stack = "backend" | "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service";
export type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
export type SharedPackage = "auth" | "config" | "middleware" | "utils";
export type Package = BackendPackage | FrontendPackage | SharedPackage;
export interface LogRequestBody {
    stack: Stack;
    level: Level;
    package: Package;
    message: string;
}
export interface LogSuccessResponse {
    logID: string;
    message: string;
}
export interface LogErrorResponse {
    message: string;
    [key: string]: unknown;
}
