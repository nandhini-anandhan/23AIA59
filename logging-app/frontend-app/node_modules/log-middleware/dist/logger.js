let config = {
    baseUrl: "http://4.224.186.213",
    mirrorToConsole: true,
};
export function configureLogger(userConfig) {
    config = Object.assign(Object.assign({}, config), userConfig);
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
export async function Log(stack, level, pkg, message) {
    const body = {
        stack,
        level,
        package: pkg,
        message,
    };
    if (config.mirrorToConsole !== false) {
        const consoleMethod = level === "error" || level === "fatal"
            ? console.error
            : level === "warn"
                ? console.warn
                : console.log;
        consoleMethod(`[${stack}:${pkg}] (${level}) ${message}`);
    }
    try {
        const headers = {
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
            const errorData = await response
                .json()
                .catch(() => ({ message: response.statusText }));
            if (config.mirrorToConsole !== false) {
                console.error("Log API error:", response.status, errorData.message);
            }
            return null;
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        if (config.mirrorToConsole !== false) {
            console.error("Log API request failed:", err);
        }
        return null;
    }
}
