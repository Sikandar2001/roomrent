"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type FavoriteRoom = {
  id: string;
  title: string;
  city: string;
  rent: string | number;
  photos?: string[];
};

export default function FavouritePage() {
  const [rooms, setRooms] = useState<FavoriteRoom[]>([]);
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
    if (!userId || !db) {
      Promise.resolve().then(() => {
        setRooms([]);
        setLoading(false);
      });
      return;
    }

    const q = query(collection(db!, `users/${userId}/favorites`));
    const unsub = onSnapshot(q, async (snap) => {
      const ids = snap.docs.map((d) => d.id);
      const fetched: FavoriteRoom[] = [];
      
      for (const id of ids) {
        try {
          const roomSnap = await getDoc(doc(db!, "rooms", id));
          if (roomSnap.exists()) {
            const data = roomSnap.data();
            fetched.push({
              id: roomSnap.id,
              title: data.title || data.project || "Room",
              city: data.city || "—",
              rent: data.rent || 0,
              photos: data.photos,
            });
          }
        } catch (e) {
          console.error("Failed to fetch room:", id, e);
        }
      }
      setRooms(fetched);
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  const removeFavorite = async (id: string) => {
    if (!userId || !db) return;
    try {
      await deleteDoc(doc(db, `users/${userId}/favorites`, id));
    } catch (e) {
      console.error("Failed to remove:", e);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-zinc-600">Please login to see your favorite rooms.</p>
        <Link href="/login" className="rounded-md bg-[#113b8f] px-6 py-2 text-white">Login</Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-zinc-900">Your Favourite Rooms</h1>
      {rooms.length === 0 ? (
        <div className="mt-10 text-center text-zinc-500">
          No favorite rooms yet. Go back to <Link href="/" className="text-[#113b8f] underline">Home</Link> to explore.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div key={room.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="relative aspect-video">
                <Image
                  src={room.photos?.[0] || "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop"}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeFavorite(room.id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-rose-600 shadow-sm hover:bg-white"
                >
                  ❤️
                </button>
              </div>
              <div className="p-4">
                <Link href={`/rooms/${room.id}`} className="text-lg font-semibold text-zinc-900 hover:text-[#113b8f]">
                  {room.title}
                </Link>
                <p className="text-sm text-zinc-600">{room.city}</p>
                <p className="mt-2 font-bold text-[#113b8f]">₹{room.rent}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
