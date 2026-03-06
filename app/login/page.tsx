"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const firebaseReady = isClient && !!auth;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative hidden min-h-[560px] md:block">
            <Image
              src="/images/login-hero.svg"
              alt="Login"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 0vw, 50vw"
            />
            <div className="absolute inset-0 rounded-l-2xl ring-1 ring-inset ring-white/20" />
          </div>
          <div className="p-8 sm:p-12">
            <div className="max-w-md">
              <button
                className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900"
                onClick={() => history.back()}
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mr-2 h-5 w-5"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back
              </button>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                Log in
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold underline">
                  Create an Account
                </Link>
              </p>
              <form
                className="mt-8 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError("");
                  setLoading(true);
                  try {
                    if (!auth) {
                      throw new Error("Firebase is not configured");
                    }
                    const trimmedEmail = email.trim().toLowerCase();
                    await signInWithEmailAndPassword(auth, trimmedEmail, password);
                    router.push("/");
                  } catch (err: unknown) {
                    const msg =
                      err instanceof Error ? err.message : "Login failed";
                    setError(msg);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div>
                  <label className="sr-only">Email</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full rounded-full border border-zinc-300 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label className="sr-only">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full rounded-full border border-zinc-300 px-4 py-3 pr-12 text-sm outline-none placeholder:text-zinc-400 focus:border-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                        <path d="M3 3l18 18M10.73 5.08A9.77 9.77 0 0112 5c7 0 10 7 10 7a16.6 16.6 0 01-4.03 5.19M6.1 6.93A16.6 16.6 0 002 12s3 7 10 7a9.9 9.9 0 003.27-.55" />
                        <path d="M15.54 15.54A3.5 3.5 0 018.46 8.46" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                  <div className="mt-2 text-right">
                    <Link href="#" className="text-xs font-medium text-zinc-700 underline">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <label className="mt-2 inline-flex items-center gap-2 text-sm text-zinc-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
                  I agree to the{" "}
                  <Link href="#" className="font-semibold underline">
                    Terms &amp; Conditions
                  </Link>
                </label>

                {error ? (
                  <div className="text-sm font-medium text-rose-600">{error}</div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading || !firebaseReady}
                  className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>

                <div className="relative py-3 text-center">
                  <span className="bg-white px-3 text-xs text-zinc-500">or</span>
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={loading || !firebaseReady}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-4 py-3 text-sm font-medium hover:bg-zinc-50"
                    onClick={async () => {
                      setError("");
                      setLoading(true);
                      try {
                        if (!auth) {
                          throw new Error("Firebase is not configured");
                        }
                        const provider = new GoogleAuthProvider();
                        await signInWithPopup(auth, provider);
                        router.push("/");
                      } catch (err: unknown) {
                        const msg =
                          err instanceof Error ? err.message : "Google login failed";
                        setError(msg);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M21.6 12.23c0-.61-.05-1.2-.16-1.77H12v3.36h5.4a4.62 4.62 0 01-2 3.03v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.12z" />
                      <path d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.58-4.12H3.05v2.58A9.99 9.99 0 0012 22z" />
                      <path d="M6.42 13.91a6.01 6.01 0 010-3.82V7.51H3.05a10 10 0 000 8.98l3.37-2.58z" />
                      <path d="M12 6.1c1.47 0 2.8.5 3.84 1.48l2.88-2.88C17 2.9 14.73 2 12 2A10 10 0 003.05 7.51L6.42 10c.78-2.36 2.98-3.9 5.58-3.9z" />
                    </svg>
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-4 py-3 text-sm font-medium hover:bg-zinc-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M13 20v-6h2.2l.3-2H13V9.5c0-.6.2-1 1.1-1H16V6.2c-.2 0-.9-.2-1.8-.2-1.8 0-3 .9-3 3V12H9v2h2v6h2z" />
                    </svg>
                    Continue with Facebook
                  </button>
                </div>
              </form>
              <div suppressHydrationWarning>
                {!firebaseReady && (
                  <div className="mt-4 rounded-md bg-amber-100 p-3 text-sm text-amber-900">
                    Firebase is not configured. Add keys to .env.local and restart the dev server.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
