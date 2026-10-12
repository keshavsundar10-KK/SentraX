import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ShieldCheck } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white animate-pulse mb-4">
          <ShieldCheck size={28} />
        </div>
        <p className="text-sm font-medium text-slate-600">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
