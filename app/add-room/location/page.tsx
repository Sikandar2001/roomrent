"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { X, LogIn } from "lucide-react";

function LocationPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get("id");
  const [city, setCity] = useState("");
  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    if (!auth?.currentUser) {
      // If user is not logged in, we could redirect them back to the first step
      // but let's just ensure they see the popup if they try to save
    }
    if (roomId) {
      const fetchRoom = async () => {
        try {
          const res = await fetch(`/api/rooms?id=${roomId}`);
          if (res.ok) {
            const data = await res.json();
            setCity(data.city || "");
            setProject(data.project || "");
            setTitle(data.title || "");
            setDescription(data.description || "");
          }
        } catch (e) {
          console.log("Failed to fetch room:", e);
        }
      };
      fetchRoom();
    }
  }, [roomId]);
  const saveDraft = async (e: React.MouseEvent) => {
    if (!auth?.currentUser) {
      e.preventDefault();
      setShowLoginPopup(true);
      return;
    }
    if (!city || !title) {
      e.preventDefault();
      setError("Please fill City and Property Title.");
      return;
    }
    setError("");
    try {
      const next = { city, project, title, description };
      const id = roomId || localStorage.getItem("roomDocId");
      if (id) {
        await fetch(`/api/rooms?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
      }
    } catch (e) {
      console.log("Save error:", e);
    }
  };
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Property Location</h1>
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-zinc-700">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              placeholder="Enter City"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-[#edf4ff] px-3 py-2 text-sm outline-none ring-blue-600/20 placeholder:text-zinc-400 focus:ring-2"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (e.target.value) setError("");
              }}
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
              Property Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              placeholder="e.g. Beautiful 2BHK Flat for Rent"
              className="mt-2 w-full border-b border-zinc-300 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value) setError("");
              }}
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
          {error && (
            <div className="mt-2 text-xs font-medium text-red-600">
              {error}
            </div>
          )}
        </div>
        <div className="mt-8 flex items-center justify-end">
          <Link
            href={roomId ? `/add-room/features?id=${roomId}` : "/add-room/features"}
            className="inline-flex items-center rounded-md bg-[#113b8f] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0d3278] transition-all active:scale-95"
            onClick={saveDraft}
          >
            Next
          </Link>
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-2xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => setShowLoginPopup(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-blue-50 p-4 text-[#113b8f]">
                <LogIn className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">Login Required</h3>
              <p className="mt-2 text-zinc-600">
                You need to log in to your account to post a property. It only takes a minute!
              </p>
              
              <div className="mt-8 flex w-full flex-col gap-3">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full rounded-full bg-[#113b8f] py-3 text-sm font-semibold text-white transition hover:bg-[#0d3278] active:scale-[0.98]"
                >
                  Login Now
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="w-full rounded-full border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98]"
                >
                  Create an Account
                </button>
              </div>
              
              <button
                onClick={() => setShowLoginPopup(false)}
                className="mt-4 text-xs font-medium text-zinc-400 hover:text-zinc-600"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
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
