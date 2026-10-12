
const API_BASE = "/api";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}

let csrfPromise = null;
async function ensureCsrfToken() {
  const existingCookie = getCookie("XSRF-TOKEN");
  if (existingCookie) return existingCookie;

  if (!csrfPromise) {
    csrfPromise = fetch(`${API_BASE}/auth/csrf`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.token || getCookie("XSRF-TOKEN"))
      .catch(() => null)
      .finally(() => {
        csrfPromise = null;
      });
  }
  return csrfPromise;
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Attach CSRF token for state-mutating requests
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      headers["X-XSRF-TOKEN"] = csrfToken;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } else {
    const text = await response.text();
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication & Profile
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  getCurrentUser: () => request("/auth/me"),

  getCsrfToken: () => request("/auth/csrf"),

  updateProfile: (profile) =>
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),

  changePassword: (passwords) =>
    request("/auth/password", {
      method: "PUT",
      body: JSON.stringify(passwords),
    }),

  // Tasks
  getTasks: () => request("/tasks"),
  getTask: (id) => request(`/tasks/${id}`),
  createTask: (task) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  // Security evaluation
  evaluateAction: (taskId, proposedAction) =>
    request("/security/evaluate", {
      method: "POST",
      body: JSON.stringify({ taskId: Number(taskId), proposedAction }),
    }),

  // Security events and metrics
  getSecurityEvents: () => request("/security/events"),
  getSecurityMetrics: () => request("/security/metrics"),
};

export default api;
