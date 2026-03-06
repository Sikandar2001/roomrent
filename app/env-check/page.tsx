"use client";
import { auth } from "@/lib/firebase";

export default function EnvCheckPage() {
  const items = [
    ["NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY],
    ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN],
    ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID],
    ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET],
    ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID],
    ["NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID],
  ];
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Env Check</h1>
      <div className="mt-4 rounded-md border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50">
              <th className="p-2 text-left">Key</th>
              <th className="p-2 text-left">Present</th>
            </tr>
          </thead>
          <tbody>
            {items.map(([k, v]) => (
              <tr key={k} className="border-t">
                <td className="p-2">{k}</td>
                <td className="p-2">{v ? "yes" : "no"}</td>
              </tr>
            ))}
            <tr className="border-t">
              <td className="p-2">auth initialized</td>
              <td className="p-2">{auth ? "yes" : "no"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
