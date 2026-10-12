
import { useCallback, useEffect, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, Clock3, LayoutDashboard,
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
  return <aside className={`flex h-full flex-col border-r border-slate-200 bg-white ${mobile ? "w-full" : "w-64"}`}>
    <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><ShieldCheck size={22} /></div><div><h2 className="text-lg font-bold text-slate-900">SentraX</h2><p className="text-xs text-slate-500">Security workspace</p></div>{mobile && <button onClick={onNavigate} className="ml-auto rounded-lg p-2"><X size={19} /></button>}</div>
    <nav className="flex-1 space-y-1 px-4 py-7"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>{navigation.map(({ name, path, icon: Icon }) => { const active = window.location.pathname === path; return <a key={path} href={path} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={19} />{name}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}</a>; })}</nav>
    <div className="border-t border-slate-100 p-5"><p className="text-sm text-slate-600">● Workspace ready</p><p className="mt-2 text-xs text-slate-400">SentraX MVP</p></div>
  </aside>;
}

function severityClass(value) {
  const severity = String(value ?? "Info").toLowerCase();
  if (["critical", "high", "error"].includes(severity)) return "bg-rose-50 text-rose-700";
  if (["medium", "warning", "moderate"].includes(severity)) return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function dateLabel(value) {
  if (!value) return "Time unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString();
}

export default function SecurityEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      setError("");
      const response = await fetch(`${API}/security/events`, { credentials: "include" });
      if (!response.ok) throw new Error(`Could not load events (${response.status}).`);
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load security events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    const timer = window.setInterval(loadEvents, 15000);
    const focus = () => loadEvents();
    window.addEventListener("focus", focus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", focus);
    };
  }, [loadEvents]);

  const highCount = events.filter(e => ["critical", "high", "error"].includes(String(e.severity ?? e.level ?? e.status ?? "").toLowerCase())).length;
  const warningCount = events.filter(e => ["medium", "warning", "moderate"].includes(String(e.severity ?? e.level ?? e.status ?? "").toLowerCase())).length;

  const filtered = events.filter(event => {
    const severity = String(event.severity ?? event.level ?? event.status ?? "info").toLowerCase();
    const text = `${event.type ?? event.eventType ?? event.event_type ?? ""} ${event.description ?? event.message ?? ""} ${event.id ?? ""}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase().trim());
    const matchesSeverity = severityFilter === "all" ||
      (severityFilter === "high" && ["critical", "high", "error"].includes(severity)) ||
      (severityFilter === "warning" && ["medium", "warning", "moderate"].includes(severity)) ||
      (severityFilter === "info" && !["critical", "high", "error", "medium", "warning", "moderate"].includes(severity));
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-slate-50/80">
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block"><Sidebar /></div>
      {mobileMenuOpen && <div className="fixed inset-0 z-50 md:hidden"><button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/30" /><div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl"><Sidebar mobile onNavigate={() => setMobileMenuOpen(false)} /></div></div>}
      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden"><Menu size={20} /></button><div><p className="text-sm font-semibold text-slate-900">Security workspace</p><p className="mt-1 text-xs text-slate-500">Events and alerts</p></div></div><button onClick={loadEvents} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><RefreshCw size={15} />Refresh</button></header>
        <main className="space-y-7 px-4 py-6 sm:px-6 lg:px-8">
          <div><p className="text-sm font-medium text-blue-600">Monitoring</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Security Events</h1><p className="mt-1 text-sm text-slate-500">Review event records returned by your security API.</p></div>
          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          <section className="grid gap-4 sm:grid-cols-3">
            {[{ label: "Total events", value: events.length, icon: Activity, tone: "bg-blue-50 text-blue-600" }, { label: "High severity", value: highCount, icon: ShieldAlert, tone: "bg-rose-50 text-rose-600" }, { label: "Warnings", value: warningCount, icon: AlertTriangle, tone: "bg-amber-50 text-amber-600" }].map(({ label, value, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p><span className={`rounded-xl p-2.5 ${tone}`}><Icon size={19} /></span></div><p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? "—" : value}</p><p className="mt-2 text-xs text-slate-500">From current event records</p></div>)}
          </section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-900">Event log</h2><p className="mt-1 text-sm text-slate-500">Showing {filtered.length} of {events.length} events</p></div><div className="flex flex-col gap-3 sm:flex-row"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." aria-label="Search events" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /><select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} aria-label="Filter severity" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"><option value="all">All severities</option><option value="high">High / critical</option><option value="warning">Warnings</option><option value="info">Other</option></select></div></div>
            {loading ? <p className="p-8 text-sm text-slate-500">Loading security events…</p> : filtered.length === 0 ? <div className="px-6 py-14 text-center"><ShieldCheck size={30} className="mx-auto text-slate-400" /><h3 className="mt-3 font-medium text-slate-800">No matching events</h3><p className="mt-1 text-sm text-slate-500">{events.length ? "Try another search or severity filter." : "The API has not returned any event records."}</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Event</th><th className="px-5 py-3">Severity</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">Time</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((event, index) => { const id = event.id ?? index; const severity = event.severity ?? event.level ?? event.status ?? "Info"; return <tr key={id} className="hover:bg-slate-50/70"><td className="px-5 py-4 text-sm font-medium text-slate-800">{event.type ?? event.eventType ?? event.event_type ?? event.name ?? "Security event"}<p className="mt-1 text-xs font-normal text-slate-400">ID: {id}</p></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${severityClass(severity)}`}>{severity}</span></td><td className="max-w-sm px-5 py-4 text-sm text-slate-500">{event.description ?? event.message ?? event.details ?? "No description provided"}</td><td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{dateLabel(event.timestamp ?? event.createdAt ?? event.created_at)}</span></td></tr>; })}</tbody></table></div>}
          </section>
        </main>
      </div>
    </div>
  );
}
