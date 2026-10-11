export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  danger,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        <div
          className={`rounded-lg p-3 ${
            danger
              ? "bg-red-50 text-red-600"
              : "bg-cyan-50 text-cyan-600"
          }`}
        >
          <Icon size={21} />
        </div>
      </div>

      <p
        className={`mt-4 text-xs ${
          danger
            ? "text-red-600"
            : "text-emerald-600"
        }`}
      >
        {change}
      </p>
    </div>
  );
}