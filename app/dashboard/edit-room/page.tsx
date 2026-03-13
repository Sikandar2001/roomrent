"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Pencil, Trash2, Plus } from "lucide-react";

type Room = {
  id: string;
  title: string;
  city: string;
  rent: string | number;
  photos?: string[];
  propertyType: string;
  createdAt?: Timestamp;
};

export default function EditRoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserId(u?.uid || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms");
        if (res.ok) {
          const data = await res.json();
          // Filter by current user uid
          const filtered = data
            .filter((v: any) => v.uid === userId)
            .map((v: any) => ({
              id: v.id,
              title: v.title || v.project || "Unnamed Property",
              city: v.city || "No City",
              rent: v.rent || 0,
              photos: v.photos,
              propertyType: v.propertyType || "Room",
              createdAt: v.createdAt,
            }));
          setRooms(filtered);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await fetch(`/api/rooms?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r.id !== id));
      } else {
        throw new Error("Delete failed");
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-zinc-600">Please login to manage your properties.</p>
        <Link href="/login" className="rounded-md bg-[#113b8f] px-6 py-2 text-white">Login</Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">My Properties</h1>
        <Link 
          href="/add-room" 
          className="flex items-center gap-2 rounded-md bg-[#113b8f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d3278]"
        >
          <Plus className="h-4 w-4" /> Add New
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-zinc-200 p-12 text-center">
          <p className="text-zinc-500">You haven&apos;t uploaded any properties yet.</p>
          <Link href="/add-room" className="mt-4 inline-block text-[#113b8f] font-semibold hover:underline">
            Post your first ad now
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div key={room.id} className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative aspect-video">
                <Image
                  src={room.photos?.[0] || "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop"}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white uppercase">
                  {room.propertyType}
                </div>
              </div>
              <div className="p-4">
                <h3 className="truncate text-lg font-semibold text-zinc-900">{room.title}</h3>
                <p className="text-sm text-zinc-600">{room.city}</p>
                <p className="mt-2 font-bold text-[#113b8f]">₹{room.rent}</p>
                
                <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4">
                  <Link
                    href={`/add-room?id=${room.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="flex items-center justify-center rounded-md border border-rose-100 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"
                    title="Delete Property"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
