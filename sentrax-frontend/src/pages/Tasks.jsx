
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, BarChart3, CheckCircle2, Clock3, LayoutDashboard,
  ListTodo, Menu, RefreshCw, Search, ShieldAlert, ShieldCheck, X, User,
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
  return <aside className={`flex h-full flex-col border-r border-slate-200 bg-white ${mobile ? "w-full" : "w-64"}`}>
    <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><ShieldCheck size={22} /></div><div><h2 className="text-lg font-bold text-slate-900">SentraX</h2><p className="text-xs text-slate-500">Security workspace</p></div>{mobile && <button onClick={onNavigate} className="ml-auto rounded-lg p-2"><X size={19} /></button>}</div>
    <nav className="flex-1 space-y-1 px-4 py-7"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>{navigation.map(({ name, path, icon: Icon }) => { const active = window.location.pathname === path; return <a key={path} href={path} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={19} />{name}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}</a>; })}</nav>
    <div className="border-t border-slate-100 p-5"><p className="text-sm text-slate-600">● Workspace ready</p><p className="mt-2 text-xs text-slate-400">SentraX MVP</p></div>
  </aside>;
}

function statusOf(task) {
  return String(task.status ?? task.state ?? "Pending");
}

function statusClass(status) {
  const value = status.toLowerCase();
  if (["completed", "success", "successful"].includes(value)) return "bg-emerald-50 text-emerald-700";
  if (["blocked", "failed", "denied", "error"].includes(value)) return "bg-rose-50 text-rose-700";
  if (["running", "in_progress", "processing"].includes(value)) return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

function dateLabel(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadTasks = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      setError("");
      const response = await fetch(`${API}/tasks`, { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load tasks.");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not retrieve tasks.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    const timer = window.setInterval(() => loadTasks(), 15000);
    const focus = () => loadTasks();
    const update = () => loadTasks();
    window.addEventListener("focus", focus);
    window.addEventListener("sentrax-tasks-updated", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", focus);
      window.removeEventListener("sentrax-tasks-updated", update);
    };
  }, [loadTasks]);

  const counts = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => ["completed", "success", "successful"].includes(statusOf(t).toLowerCase())).length,
    blocked: tasks.filter(t => ["blocked", "failed", "denied", "error"].includes(statusOf(t).toLowerCase())).length,
  }), [tasks]);

  const filtered = useMemo(() => tasks.filter(task => {
    const title = task.name ?? task.title ?? task.originalIntent ?? task.original_intent ?? "";
    const description = task.description ?? task.intent ?? "";
    const status = statusOf(task).toLowerCase();
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${title} ${description} ${task.id ?? ""}`.toLowerCase().includes(query);
    const matchesFilter = filter === "all" ||
      (filter === "completed" && ["completed", "success", "successful"].includes(status)) ||
      (filter === "blocked" && ["blocked", "failed", "denied", "error"].includes(status)) ||
      (filter === "other" && !["completed", "success", "successful", "blocked", "failed", "denied", "error"].includes(status));
    return matchesSearch && matchesFilter;
  }), [tasks, search, filter]);

  return (
    <div className="min-h-screen bg-slate-50/80">
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block"><Sidebar /></div>
      {mobileMenuOpen && <div className="fixed inset-0 z-50 md:hidden"><button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/30" /><div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl"><Sidebar mobile onNavigate={() => setMobileMenuOpen(false)} /></div></div>}
      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden"><Menu size={20} /></button><div><p className="text-sm font-semibold text-slate-900">Security workspace</p><p className="mt-1 text-xs text-slate-500">Task management</p></div></div><button onClick={() => loadTasks(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />Refresh</button></header>
        <main className="space-y-7 px-4 py-6 sm:px-6 lg:px-8">
          <div><p className="text-sm font-medium text-blue-600">Task management</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Tasks</h1><p className="mt-1 text-sm text-slate-500">Monitor tasks recorded by SentraX.</p></div>
          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          <section className="grid gap-4 sm:grid-cols-3">
            {[{ label: "Total tasks", value: counts.total, icon: ListTodo, tone: "bg-blue-50 text-blue-600" }, { label: "Completed", value: counts.completed, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" }, { label: "Blocked or failed", value: counts.blocked, icon: ShieldAlert, tone: "bg-rose-50 text-rose-600" }].map(({ label, value, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p><span className={`rounded-xl p-2.5 ${tone}`}><Icon size={19} /></span></div><p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? "—" : value}</p><p className="mt-2 text-xs text-slate-500">Based on API task data</p></div>)}
          </section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-900">All tasks</h2><p className="mt-1 text-sm text-slate-500">Showing {filtered.length} of {tasks.length} tasks</p></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." aria-label="Search tasks" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-56" /></div><select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter tasks" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"><option value="all">All statuses</option><option value="completed">Completed</option><option value="blocked">Blocked or failed</option><option value="other">Other statuses</option></select></div></div>
            {loading ? <div className="space-y-3 p-6"><div className="h-14 animate-pulse rounded-lg bg-slate-100" /><div className="h-14 animate-pulse rounded-lg bg-slate-100" /></div> : filtered.length === 0 ? <div className="px-6 py-14 text-center"><ListTodo size={30} className="mx-auto text-slate-400" /><h3 className="mt-3 font-medium text-slate-800">{tasks.length ? "No matching tasks" : "No tasks yet"}</h3><p className="mt-1 text-sm text-slate-500">{tasks.length ? "Try changing your search or filter." : "Run a task in Live Demo to populate this list."}</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3">Task</th><th className="px-6 py-3">ID</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Created</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((task, index) => { const title = task.name ?? task.title ?? task.originalIntent ?? task.original_intent ?? `Task ${index + 1}`; const id = task.id ?? task.taskId ?? task.task_id ?? index; const status = statusOf(task); return <tr key={id} className="hover:bg-slate-50/70"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="rounded-lg bg-slate-100 p-2 text-slate-600"><Activity size={16} /></span><div className="max-w-sm"><p className="truncate text-sm font-medium text-slate-800">{title}</p>{(task.description ?? task.intent) && <p className="mt-1 truncate text-xs text-slate-500">{task.description ?? task.intent}</p>}</div></div></td><td className="px-6 py-4 text-sm text-slate-500">{id}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusClass(status)}`}>{status.replaceAll("_", " ")}</span></td><td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{dateLabel(task.createdAt ?? task.created_at ?? task.timestamp)}</span></td></tr>; })}</tbody></table></div>}
          </section>
        </main>
      </div>
    </div>
  );
}
