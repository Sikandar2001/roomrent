"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

function LocationPageInner() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const [city, setCity] = useState("");
  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (roomId && db) {
      const fetchRoom = async () => {
        try {
          const snap = await getDoc(doc(db!, "rooms", roomId));
          if (snap.exists()) {
            const data = snap.data();
            setCity(data.city || "");
            setProject(data.project || "");
            setTitle(data.title || "");
            setDescription(data.description || "");
          }
        } catch (e) {
          console.error("Failed to fetch room:", e);
        }
      };
      fetchRoom();
    }
  }, [roomId]);
  const saveDraft = () => {
    try {
      const prev = JSON.parse(localStorage.getItem("roomDraft") || "{}");
      const next = { ...prev, city, project, title, description };
      localStorage.setItem("roomDraft", JSON.stringify(next));
      const id = roomId || localStorage.getItem("roomDocId");
      if (roomId) localStorage.setItem("roomDocId", roomId);
      if (db && id) {
        updateDoc(doc(db, "rooms", id), { city, project, title, description });
      }
    } catch {}
  };
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Property Location</h1>
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-zinc-700">
              City
            </label>
            <input
              id="city"
              placeholder="Enter City"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-[#edf4ff] px-3 py-2 text-sm outline-none ring-blue-600/20 placeholder:text-zinc-400 focus:ring-2"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-zinc-700">
              Name of Project/Society
            </label>
            <input
              id="project"
              placeholder="Name Of Project/Society"
              className="mt-2 w-full border-b border-zinc-300 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
              value={project}
              onChange={(e)=>setProject(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
              Property Title
            </label>
            <input
              id="title"
              placeholder="e.g. Beautiful 2BHK Flat for Rent"
              className="mt-2 w-full border-b border-zinc-300 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Write about your property details, amenities, etc."
              rows={4}
              className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-blue-600/20 focus:ring-2"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end">
          <Link
            href={roomId ? `/add-room/features?id=${roomId}` : "/add-room/features"}
            className="inline-flex items-center rounded-md bg-[#113b8f] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0d3278]"
            onClick={saveDraft}
          >
            Next
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LocationPage() {
  return (
    <Suspense fallback={null}>
      <LocationPageInner />
    </Suspense>
  );
}
