import { useState } from "react";
import {
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "SX";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!profileForm.name.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }
    if (!profileForm.email.trim()) {
      setProfileError("Email cannot be empty.");
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
      });
      setProfileSuccess("Profile information updated successfully.");
    } catch (err) {
      setProfileError(
        err.message || "Failed to update profile. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!passwordForm.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.message || "Failed to change password. Please check your current password."
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900">
      <div className="fixed inset-y-0 left-0 z-30 hidden md:block">
        <Sidebar />
      </div>

      <div className="min-w-0 md:ml-64">
        <Navbar />

        <main className="space-y-7 px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Account Settings
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                User Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your personal information and account security settings.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span className="text-xs font-medium text-slate-600">
                Session Active & Protected
              </span>
            </div>
          </header>

          {/* User Overview Card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-2xl font-bold text-cyan-700">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900 truncate">
                    {user?.name || "User"}
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                    Active User
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Settings Grid */}
          <div className="grid gap-7 lg:grid-cols-2">
            {/* Profile Editing Section */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <User size={19} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Profile Information
                    </h2>
                    <p className="text-xs text-slate-500">
                      Update your account name and email address
                    </p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
                  {profileSuccess && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                      <span>{profileSuccess}</span>
                    </div>
                  )}

                  {profileError && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                      <AlertCircle size={16} className="shrink-0 text-rose-600" />
                      <span>{profileError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={254}
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      placeholder="your.email@example.com"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Used for authentication and security notifications.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
                    >
                      {profileLoading ? "Saving Changes..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Password Change Flow (Separate Secure Section) */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <KeyRound size={19} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Change Password
                    </h2>
                    <p className="text-xs text-slate-500">
                      Secure authentication credential management
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
                  {passwordSuccess && (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                      <AlertCircle size={16} className="shrink-0 text-rose-600" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        aria-label={showCurrent ? "Hide password" : "Show password"}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="At least 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        aria-label={showNew ? "Hide password" : "Show password"}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        placeholder="Re-enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
                    >
                      {passwordLoading ? "Updating Password..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
