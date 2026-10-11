
const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const api = {
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
