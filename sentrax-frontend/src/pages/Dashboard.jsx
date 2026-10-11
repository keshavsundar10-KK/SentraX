
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  ShieldAlert,
  Zap,
  RefreshCw,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import SecurityAlert from "../components/SecurityAlert";
import api from "../services/api";

function formatTime(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleString();
}

function alertType(event) {
  if (event.decision === "BLOCK") {
    return "Security Action Blocked";
  }
  if (event.decision === "FLAG") {
    return "Action Requires Review";
  }
  return "Action Allowed";
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    allowCount: 0,
    flagCount: 0,
    blockCount: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const [metricsData, taskData, eventData] = await Promise.all([
        api.getSecurityMetrics(),
        api.getTasks(),
        api.getSecurityEvents(),
      ]);

      setMetrics(metricsData);
      setTasks(taskData);
      setEvents(eventData);
    } catch (err) {
      setError(
        err.message ||
          "Could not load live data. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    const intervalId = window.setInterval(loadDashboard, 15000);
    return () => window.clearInterval(intervalId);
  }, [loadDashboard]);

  const recentAlerts = events.slice(0, 5).map((event) => ({
    type: alertType(event),
    message: event.reason,
    status:
      event.decision === "BLOCK"
        ? "BLOCKED"
        : event.decision === "FLAG"
          ? "FLAGGED"
          : "ALLOWED",
    time: formatTime(event.createdAt),
  }));

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <main className="p-8">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    error ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                <span
                  className={`text-xs font-medium uppercase tracking-widest ${
                    error ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {error ? "Connection Issue" : "Security Monitoring"}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Security Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Live monitoring of SentraX task and security activity.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Registered Tasks"
              value={loading ? "…" : tasks.length}
              change="Tasks saved in the database"
              icon={Activity}
            />

            <StatCard
              title="Allowed Actions"
              value={loading ? "…" : metrics.allowCount}
              change="Recorded ALLOW decisions"
              icon={CheckCircle2}
            />

            <StatCard
              title="Blocked Actions"
              value={loading ? "…" : metrics.blockCount}
              change={`${metrics.flagCount} flagged for review`}
              icon={ShieldAlert}
              danger
            />

            <StatCard
              title="Total Evaluations"
              value={loading ? "…" : metrics.totalEvents}
              change="Saved security events"
              icon={Zap}
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Security Activity
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Most recent decisions recorded by SentraX
                  </p>
                </div>

                <div className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-600">
                  LIVE
                </div>
              </div>

              <div className="mt-5">
                {recentAlerts.length ? (
                  recentAlerts.map((alert, index) => (
                    <SecurityAlert key={events[index]?.id ?? index} {...alert} />
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-gray-500">
                    {loading
                      ? "Loading security events…"
                      : "No events recorded yet. Evaluate an action in the Live Demo to begin."}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Protection Status
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Backend connectivity and recorded decisions
              </p>

              <div className="mt-8 flex flex-col items-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100">
                    <ShieldAlert size={32} className="text-emerald-600" />
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-emerald-600">
                  {error ? "Connection Issue" : "Monitoring Active"}
                </h3>

                <p className="mt-2 text-center text-xs leading-5 text-gray-500">
                  {error
                    ? "SentraX could not retrieve current backend data."
                    : "Rule-based security evaluation and database event logging are available."}
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Flagged actions</span>
                  <span className="font-medium text-gray-900">
                    {metrics.flagCount}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{
                      width: `${
                        metrics.totalEvents
                          ? (metrics.flagCount / metrics.totalEvents) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {metrics.totalEvents
                    ? `${Math.round(
                        (metrics.blockCount / metrics.totalEvents) * 100
                      )}% of recorded events were blocked.`
                    : "No evaluations recorded yet."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Recent Tasks</h2>
            <p className="mt-1 text-xs text-gray-500">
              Original user intents registered with SentraX
            </p>

            {tasks.length === 0 ? (
              <p className="mt-5 text-sm text-gray-500">
                No tasks registered yet. Open Tasks to create one.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-gray-100">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-wrap items-start justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        #{task.id} · {task.title}
                      </p>
                      <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
                        {task.originalIntent}
                      </p>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
