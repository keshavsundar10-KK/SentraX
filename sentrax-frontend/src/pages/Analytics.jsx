
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  ListTodo,
  Menu,
  X,
  User,
} from "lucide-react";

const API = "/api";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Tasks", path: "/tasks", icon: ListTodo },
  { name: "Live Demo", path: "/live-demo", icon: Activity },
  { name: "Security Events", path: "/security-events", icon: ShieldCheck },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Profile", path: "/profile", icon: User },
];

function taskDate(task) {
  const value = task.createdAt ?? task.created_at ?? task.timestamp;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon;
  const active = window.location.pathname === item.path;

  return (
    <a
      href={item.path}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={19} />
      <span>{item.name}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
    </a>
  );
}

function Sidebar({ mobile = false, onNavigate }) {
  return (
    <aside
      className={`flex h-full flex-col border-r border-slate-200 bg-white ${
        mobile ? "w-full" : "w-64"
      }`}
    >
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">SentraX</h2>
          <p className="text-xs text-slate-500">Security workspace</p>
        </div>
        {mobile && (
          <button
            onClick={onNavigate}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-4 py-7">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        {navigation.map(item => (
          <SidebarLink key={item.path} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-slate-100 p-5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Workspace</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">SentraX MVP</p>
      </div>
    </aside>
  );
}

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function loadAnalytics() {
    try {
      setError("");

      const responses = await Promise.all([
        fetch(`${API}/tasks`, { credentials: "include" }),
        fetch(`${API}/security/events`, { credentials: "include" }),
        fetch(`${API}/security/metrics`, { credentials: "include" }),
      ]);

      const failed = responses.find(response => !response.ok);
      if (failed) {
        throw new Error(`Analytics request failed (${failed.status}).`);
      }

      const [taskData, eventData, metricData] = await Promise.all(
        responses.map(response => response.json())
      );

      setTasks(Array.isArray(taskData) ? taskData : []);
      setEvents(Array.isArray(eventData) ? eventData : []);
      setMetrics(metricData && typeof metricData === "object" ? metricData : {});
    } catch (err) {
      setError(err.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();

    const timer = window.setInterval(loadAnalytics, 15000);
    const focus = () => loadAnalytics();
    const update = () => loadAnalytics();

    window.addEventListener("focus", focus);
    window.addEventListener("sentrax-tasks-updated", update);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", focus);
      window.removeEventListener("sentrax-tasks-updated", update);
    };
  }, []);

  const summary = useMemo(() => {
    const statuses = tasks.map(task =>
      String(task.status ?? task.state ?? "Pending").toLowerCase()
    );

    const completed = statuses.filter(status =>
      ["completed", "success", "successful"].includes(status)
    ).length;

    const blocked = statuses.filter(status =>
      ["blocked", "failed", "denied", "error"].includes(status)
    ).length;

    const highEvents = events.filter(event =>
      ["critical", "high", "error"].includes(
        String(event.severity ?? event.level ?? event.status ?? "").toLowerCase()
      )
    ).length;

    return {
      total: tasks.length || metrics.totalTasks || metrics.total_tasks || 0,
      completed,
      blocked,
      events: events.length || metrics.totalEvents || metrics.total_events || 0,
      highEvents: highEvents || metrics.highSeverity || metrics.high_severity || 0,
    };
  }, [tasks, events, metrics]);

  const dailyActivity = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - offset);

      const count = tasks.filter(task => {
        const created = taskDate(task);
        return created &&
          created.getFullYear() === date.getFullYear() &&
          created.getMonth() === date.getMonth() &&
          created.getDate() === date.getDate();
      }).length;

      days.push({
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        dateLabel: date.toLocaleDateString(),
        count,
      });
    }

    return days;
  }, [tasks]);

  const maxCount = Math.max(1, ...dailyActivity.map(day => day.count));
  const totalOther = Math.max(
    0,
    summary.total - summary.completed - summary.blocked
  );
  const statusTotal = Math.max(1, summary.total);

  const cards = [
    {
      label: "Total tasks",
      value: summary.total,
      icon: BarChart3,
      tone: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed",
      value: summary.completed,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Security events",
      value: summary.events,
      icon: Activity,
      tone: "bg-violet-50 text-violet-600",
    },
    {
      label: "High severity",
      value: summary.highEvents,
      icon: ShieldAlert,
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/80">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl">
            <Sidebar mobile onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main page */}
      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-900">Analytics</p>
              <p className="mt-1 text-xs text-slate-500">
                Insights and workspace activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-600">SentraX</span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-7">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-blue-600">Insights and trends</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  Analytics
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Explore task activity and the security metrics currently available.
                </p>
              </div>

              <button
                onClick={loadAnalytics}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </header>

            {error && (
              <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map(({ label, value, icon: Icon, tone }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">{label}</p>
                    <span className={`rounded-xl p-2.5 ${tone}`}>
                      <Icon size={19} />
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">
                    {loading ? "—" : value}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Based on available API data
                  </p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">Task activity</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Tasks created during the last seven calendar days
                    </p>
                  </div>
                  <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <Activity size={19} />
                  </span>
                </div>

                <div className="mt-7 flex h-56 items-end gap-3 border-b border-slate-100 pb-2 sm:gap-5">
                  {dailyActivity.map(day => (
                    <div
                      key={day.dateLabel}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-xs font-medium text-slate-600">
                        {day.count}
                      </span>
                      <div className="flex w-full flex-1 items-end justify-center">
                        <div
                          title={`${day.dateLabel}: ${day.count} tasks`}
                          className="w-full max-w-12 rounded-t-lg bg-blue-500 transition-all"
                          style={{
                            height: `${Math.max(
                              day.count > 0 ? 8 : 2,
                              (day.count / maxCount) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{day.label}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Tasks without a valid creation timestamp are not included in the chart.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-2">
                <h2 className="font-semibold text-slate-900">Task status breakdown</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current status values returned by the API
                </p>

                <div className="mt-7 space-y-5">
                  {[
                    { label: "Completed", count: summary.completed, color: "bg-emerald-500" },
                    { label: "Blocked or failed", count: summary.blocked, color: "bg-rose-500" },
                    { label: "Other statuses", count: totalOther, color: "bg-blue-500" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <span className="text-sm font-medium text-slate-800">
                          {loading ? "—" : item.count}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${(item.count / statusTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">Data coverage</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    These summaries reflect records returned by the API. They are not a historical audit trail unless the backend stores that history.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
