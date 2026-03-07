"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, updatePassword, type User } from "firebase/auth";
import Link from "next/link";
import { Lock, User as UserIcon, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.currentUser) return;
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match!" });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "Password should be at least 6 characters." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await updatePassword(auth.currentUser, newPassword);
      setStatus({ type: "success", message: "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error("Password update error:", err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/requires-recent-login") {
        setStatus({ type: "error", message: "Please logout and login again to change password (security requirement)." });
      } else {
        setStatus({ type: "error", message: firebaseError.message || "Failed to update password." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-zinc-600">Please login to view your profile.</p>
        <Link href="/login" className="rounded-md bg-[#113b8f] px-6 py-2 text-white">Login</Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <UserIcon size={40} />
              </div>
              <h2 className="mt-4 font-semibold text-zinc-900 truncate w-full">
                {user.email || "User"}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">ID: {user.uid}</p>
            </div>
            
            <div className="mt-8 border-t border-zinc-100 pt-6">
              <div className="text-sm font-medium text-zinc-700">Email Address</div>
              <div className="mt-1 text-sm text-zinc-600 truncate">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Settings / Change Password */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="text-[#113b8f]" size={20} />
              <h2 className="text-lg font-bold text-zinc-900">Change Password</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700">New Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#113b8f]/20 focus:border-[#113b8f]"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Confirm New Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#113b8f]/20 focus:border-[#113b8f]"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {status && (
                <div className={`flex items-center gap-2 rounded-md p-3 text-sm ${status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                  {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#113b8f] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0d3278] disabled:opacity-50 transition-all"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
