
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Clock,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const events = [
  {
    type: "Prompt Injection",
    description: "External content attempted to override the original task.",
    severity: "HIGH",
    status: "BLOCKED",
    time: "2 minutes ago",
  },
  {
    type: "Scope Violation",
    description: "Agent attempted an action outside the permitted task scope.",
    severity: "HIGH",
    status: "BLOCKED",
    time: "8 minutes ago",
  },
  {
    type: "Suspicious Instruction",
    description:
      "Untrusted content contained an instruction to reveal sensitive data.",
    severity: "MEDIUM",
    status: "BLOCKED",
    time: "15 minutes ago",
  },
  {
    type: "Action Verified",
    description: "Document extraction matched the original task intent.",
    severity: "LOW",
    status: "ALLOWED",
    time: "21 minutes ago",
  },
  {
    type: "Action Verified",
    description: "Summarization action passed the task-integrity check.",
    severity: "LOW",
    status: "ALLOWED",
    time: "28 minutes ago",
  },
];

function SeverityBadge({ severity }) {
  const styles = {
    HIGH: "border-red-200 bg-red-50 text-red-700",
    MEDIUM: "border-amber-200 bg-amber-50 text-amber-700",
    LOW: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`rounded-md border px-2.5 py-1 text-[10px] font-semibold ${
        styles[severity] || "border-gray-200 bg-gray-50 text-gray-700"
      }`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({ status }) {
  const blocked = status === "BLOCKED";

  return (
    <span
      className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${
        blocked
          ? "bg-red-50 text-red-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function SecurityEvents() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <main className="min-h-screen bg-[#f5f7fb] p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-red-600">
              Threat Monitoring
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Security Events
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Real-time record of suspicious and verified agent actions.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <ShieldAlert className="text-red-600" size={23} />
              <p className="mt-4 text-sm text-gray-500">Threats Detected</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">8</h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <Ban className="text-red-600" size={23} />
              <p className="mt-4 text-sm text-gray-500">Actions Blocked</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">37</h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="text-emerald-600" size={23} />
              <p className="mt-4 text-sm text-gray-500">Safe Actions</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">605</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Security Event Log
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Latest actions analyzed by SentraX
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Monitoring
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500">
                    <th className="px-6 py-4 font-medium">EVENT</th>
                    <th className="px-6 py-4 font-medium">SEVERITY</th>
                    <th className="px-6 py-4 font-medium">STATUS</th>
                    <th className="px-6 py-4 font-medium">TIME</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 rounded-lg p-2 ${
                              event.status === "BLOCKED"
                                ? "bg-red-50 text-red-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {event.status === "BLOCKED" ? (
                              <AlertTriangle size={17} />
                            ) : (
                              <ShieldCheck size={17} />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {event.type}
                            </p>

                            <p className="mt-1 max-w-lg text-xs leading-5 text-gray-500">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <SeverityBadge severity={event.severity} />
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={event.status} />
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 whitespace-nowrap text-xs text-gray-500">
                          <Clock size={14} />
                          {event.time}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
