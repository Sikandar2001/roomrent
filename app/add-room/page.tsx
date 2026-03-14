"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

function AddRoomPageInner() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const [ownerType, setOwnerType] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (roomId) {
      const fetchRoom = async () => {
        try {
          const res = await fetch(`/api/rooms?id=${roomId}`);
          if (res.ok) {
            const data = await res.json();
            setOwnerType(data.ownerType || "");
            setPropertyType(data.propertyType || "");
            setPhone(data.phone || "");
          }
        } catch (e) {
          console.log("Failed to fetch room:", e);
        }
      };
      fetchRoom();
    }
  }, [roomId]);

  const saveAndGo = async () => {
    if (!phone) {
      setError("Please enter your contact number.");
      return;
    }
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit WhatsApp number.");
      return;
    }
    setError("");
    const draft = { ownerType, propertyType, phone };
    try {
      let id = roomId;
      if (id) {
        // Update existing
        const res = await fetch(`/api/rooms?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        // Create new
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...draft,
            uid: auth?.currentUser?.uid || null,
          }),
        });
        if (!res.ok) throw new Error("Create failed");
        const data = await res.json();
        id = data.id; // Firestore uses id
      }
      localStorage.setItem("roomDocId", id!);
      window.location.href = `/add-room/location?id=${id}`;
    } catch (err) {
      console.log("Save failed:", err);
    }
  };
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="flex items-center justify-center">
          <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <Image
              src="/images/add-room-hero.svg"
              alt="Post your property"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
          </div>
        </div>
        <div className="lg:pl-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900">
              Let&apos;s get you started
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Post your property ad to sell or rent online for{" "}
              <span className="font-semibold text-emerald-600">Free!</span>
            </p>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase text-zinc-700">
                You are:
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Owner", "Agent", "Builder"].map((x) => (
                  <button
                    key={x}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${ownerType===x ? "border-black bg-black text-white" : "border-zinc-300 text-zinc-800 hover:border-zinc-400"}`}
                    type="button"
                    onClick={() => setOwnerType(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase text-zinc-700">
                Property Type:
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Room", "Flat", "Shop"].map((x) => (
                  <button
                    key={x}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${propertyType===x ? "border-black bg-black text-white" : "border-zinc-300 text-zinc-800 hover:border-zinc-400"}`}
                    type="button"
                    onClick={() => setPropertyType(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase text-zinc-700">
                Your contact number <span className="text-red-500">*</span>
              </div>
              <div className="mt-2 grid grid-cols-[auto,1fr] gap-2">
                <select className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm">
                  <option>IND +91</option>
                </select>
                <input
                  className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none ring-blue-600/20 focus:ring-2"
                  placeholder="WhatsApp Number"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    if (val.length <= 10) {
                      setPhone(val);
                    }
                  }}
                />
              </div>
              <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                Enter your WhatsApp No. to get enquiries from Buyer/Tenant
              </div>
            </div>
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                {error}
              </div>
            )}
            <button
              onClick={saveAndGo}
              className="mt-5 w-full rounded-full bg-[#113b8f] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[#0d3278]"
            >
              Start Now
            </button>
            <div className="mt-3 text-center text-xs text-zinc-500">
              By continuing, you agree to our terms.
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm font-medium text-[#113b8f] hover:underline">
              Go back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AddRoomPage() {
  return (
    <Suspense fallback={null}>
      <AddRoomPageInner />
    </Suspense>
  );
}
