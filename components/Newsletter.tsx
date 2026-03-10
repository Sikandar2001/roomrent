"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };
  return (
    <section className="bg-[#0a265e] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0a265e] p-6 shadow-2xl ring-1 ring-white/10 lg:flex lg:items-center lg:justify-between lg:p-8">
          <div>
            <h3 className="text-2xl font-extrabold text-white">Subscribe Our Newsletter</h3>
            <p className="mt-1 text-sm text-white/70">
              Join our email subscription to get updates and notifications.
            </p>
          </div>
          <form onSubmit={submit} className="mt-4 flex w-full max-w-md items-center gap-2 lg:mt-0">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Your email address"
              className="h-11 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 outline-none ring-[#eab308]/20 focus:ring-2"
            />
            <button
              type="submit"
              className="h-11 rounded-lg bg-[#14b8a6] px-5 text-sm font-semibold text-white hover:bg-[#10a092]"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

