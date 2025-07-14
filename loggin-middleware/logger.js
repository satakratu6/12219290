// utils/logger.js

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

/**
 * Logs application events to AffordMed test server.
 * @param {string} token - Authorization Bearer token.
 * @param {'frontend'} stack - Always 'frontend' for frontend logging.
 * @param {'debug' | 'info' | 'warn' | 'error' | 'fatal'} level - Log severity.
 * @param {'component' | 'hook' | 'page' | 'state' | 'style'} pkg - App package involved.
 * @param {string} message - Descriptive message of the event.
 */
export async function logEvent({ token, stack, level, pkg, message }) {
  try {
    const res = await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // required for protected API
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Log failed:", data);
    }
  } catch (error) {
    console.error("Error sending log:", error);
  }
}
