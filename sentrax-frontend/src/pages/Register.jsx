import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
      <section className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="rounded-xl bg-blue-600 p-2.5 text-white">
            <ShieldCheck size={25} />
          </span>
          <span className="text-2xl font-bold text-slate-900">SentraX</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Get started with your SentraX workspace.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {[
              { name: "name", label: "Full name", type: "text", placeholder: "Your name", auto: "name" },
              { name: "email", label: "Email address", type: "email", placeholder: "you@example.com", auto: "email" },
              { name: "password", label: "Password", type: "password", placeholder: "At least 8 characters", auto: "new-password" }
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  autoComplete={field.auto}
                  required
                  minLength={field.name === "password" ? 8 : undefined}
                  maxLength={field.name === "name" ? 100 : undefined}
                  value={form[field.name]}
                  onChange={update}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}

            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <button
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
