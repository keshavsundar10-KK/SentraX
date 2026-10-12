
import { useCallback, useEffect, useState } from "react";
import {
  Activity, BarChart3, CheckCircle2, Clock3, LayoutDashboard,
  ListTodo, Menu, RefreshCw, ShieldAlert, ShieldCheck, X, User,
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

function Sidebar({ mobile = false, onNavigate }) {
  return (
    <aside className={`flex h-full flex-col border-r border-slate-200 bg-white ${mobile ? "w-full" : "w-64"}`}>
      <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><ShieldCheck size={22} /></div>
        <div><h2 className="text-lg font-bold text-slate-900">SentraX</h2><p className="text-xs text-slate-500">Security workspace</p></div>
        {mobile && <button onClick={onNavigate} className="ml-auto rounded-lg p-2 text-slate-500"><X size={19} /></button>}
      </div>
      <nav className="flex-1 space-y-1 px-4 py-7">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        {navigation.map(({ name, path, icon: Icon }) => {
          const active = window.location.pathname === path;
          return <a key={path} href={path} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={19} />{name}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}</a>;
        })}
      </nav>
      <div className="border-t border-slate-100 p-5"><p className="text-sm text-slate-600">● Workspace ready</p><p className="mt-2 text-xs text-slate-400">SentraX MVP</p></div>
    </aside>
  );
}

function timeLabel(value) {
  if (!value) return "Time unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString();
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      const responses = await Promise.all([
        fetch(`${API}/tasks`, { credentials: "include" }),
        fetch(`${API}/security/events`, { credentials: "include" }),
        fetch(`${API}/security/metrics`, { credentials: "include" }),
      ]);
      const failed = responses.find(response => !response.ok);
      if (failed) throw new Error(`Dashboard request failed (${failed.status}).`);

      const [taskData, eventData, metricData] = await Promise.all(responses.map(r => r.json()));
      setTasks(Array.isArray(taskData) ? taskData : []);
      setEvents(Array.isArray(eventData) ? eventData : []);
      setMetrics(metricData && typeof metricData === "object" ? metricData : {});
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    const timer = window.setInterval(loadDashboard, 15000);
    const onFocus = () => loadDashboard();
    const onUpdate = () => loadDashboard();
    window.addEventListener("focus", onFocus);
    window.addEventListener("sentrax-tasks-updated", onUpdate);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("sentrax-tasks-updated", onUpdate);
    };
  }, [loadDashboard]);

  const completed = tasks.filter(t => ["completed", "success", "successful"].includes(String(t.status ?? t.state ?? "").toLowerCase())).length;
  const highEvents = events.filter(e => ["critical", "high", "error"].includes(String(e.severity ?? e.level ?? e.status ?? "").toLowerCase())).length;

  const stats = [
    { label: "Total tasks", value: tasks.length || metrics.totalTasks || metrics.total_tasks || 0, icon: ListTodo, tone: "bg-blue-50 text-blue-600" },
    { label: "Completed tasks", value: completed, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Security events", value: events.length || metrics.totalEvents || metrics.total_events || 0, icon: Activity, tone: "bg-violet-50 text-violet-600" },
    { label: "High severity", value: highEvents || metrics.highSeverity || metrics.high_severity || 0, icon: ShieldAlert, tone: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/80">
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block"><Sidebar /></div>
      {mobileMenuOpen && <div className="fixed inset-0 z-50 md:hidden"><button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/30" /><div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl"><Sidebar mobile onNavigate={() => setMobileMenuOpen(false)} /></div></div>}
      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden"><Menu size={20} /></button><div><p className="text-sm font-semibold text-slate-900">Security workspace</p><p className="mt-1 text-xs text-slate-500">Monitor your SentraX activity</p></div></div>
          <button onClick={loadDashboard} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><RefreshCw size={15} />Refresh</button>
        </header>
        <main className="space-y-7 px-4 py-6 sm:px-6 lg:px-8">
          <div><p className="text-sm font-medium text-blue-600">Workspace overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1><p className="mt-1 text-sm text-slate-500">A live overview of tasks and security activity.</p></div>
          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}<button onClick={loadDashboard} className="ml-2 underline">Retry</button></div>}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p><span className={`rounded-xl p-2.5 ${tone}`}><Icon size={19} /></span></div><p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? "—" : value}</p><p className="mt-2 text-xs text-slate-500">Based on available API data</p></div>)}
          </section>
          <section className="grid gap-6 lg:grid-cols-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-3">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Recent tasks</h2><p className="mt-1 text-sm text-slate-500">Latest records returned by your API</p></div>
              {loading ? <p className="p-6 text-sm text-slate-500">Loading tasks…</p> : tasks.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No tasks found. Try running a Live Demo.</p> : <div className="divide-y divide-slate-100">{tasks.slice(0, 6).map((task, index) => { const id = task.id ?? task.taskId ?? task.task_id ?? index; const title = task.name ?? task.title ?? task.originalIntent ?? task.original_intent ?? task.intent ?? `Task ${index + 1}`; const status = String(task.status ?? task.state ?? "Pending"); const tone = ["completed", "success", "successful"].includes(status.toLowerCase()) ? "bg-emerald-50 text-emerald-700" : ["blocked", "failed", "denied", "error"].includes(status.toLowerCase()) ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"; return <div key={id} className="flex items-center justify-between gap-3 px-5 py-4"><div className="flex min-w-0 items-center gap-3"><span className="rounded-lg bg-slate-100 p-2 text-slate-600"><Activity size={16} /></span><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-400">ID: {id}</p></div></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs capitalize ${tone}`}>{status.replaceAll("_", " ")}</span></div>; })}</div>}
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
              <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">Recent security events</h2><p className="mt-1 text-sm text-slate-500">Latest event records</p></div>
              {loading ? <p className="p-6 text-sm text-slate-500">Loading events…</p> : events.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No security events returned.</p> : <div className="divide-y divide-slate-100">{events.slice(0, 5).map((event, index) => <div key={event.id ?? index} className="px-5 py-4"><div className="flex justify-between gap-3"><p className="text-sm font-medium text-slate-800">{event.type ?? event.eventType ?? event.event_type ?? event.name ?? "Security event"}</p><span className="text-xs text-slate-500">{event.severity ?? event.level ?? "Info"}</span></div><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{event.description ?? event.message ?? event.details ?? "No description provided"}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Clock3 size={12} />{timeLabel(event.timestamp ?? event.createdAt ?? event.created_at)}</p></div>)}</div>}
            </div>
          </section>
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className={`rounded-xl p-3 ${error ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}><ShieldCheck size={21} /></span><div><p className="font-semibold text-slate-900">API connection</p><p className="mt-1 text-sm text-slate-500">{error ? "One or more dashboard endpoints could not be reached." : "Dashboard data loaded successfully."}</p></div></div><p className="text-xs text-slate-400">{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Waiting for data"}</p></div>
        </main>
      </div>
    </div>
  );
}
