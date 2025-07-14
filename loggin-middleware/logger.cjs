// utils/logger.cjs

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

/**
 * Logs application events to AffordMed test server (Node.js variant).
 * @param {string} token - Authorization Bearer token.
 * @param {'frontend'|'backend'} stack
 * @param {'debug'|'info'|'warn'|'error'|'fatal'} level
 * @param {'component'|'hook'|'page'|'state'|'style'|'api'|'handler'|'db'} pkg
 * @param {string} message
 */
async function logEvent({ token, stack, level, pkg, message }) {
  try {
    const res = await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    return data;
  } catch (error) {
    console.error("Error sending log:", error);
    throw error;
  }
}

module.exports = { logEvent };
