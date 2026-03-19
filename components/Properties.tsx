"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  setDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type TabKey = "latest" | "Room" | "Flat" | "PG" | "Plot";

const TABS: { key: TabKey; label: string }[] = [
  { key: "latest", label: "LATEST" },
  { key: "Room", label: "ROOM" },
  { key: "Flat", label: "FLAT" },
  { key: "PG", label: "PG" },
  { key: "Plot", label: "PLOT" },
];

type CardData = {
  id: string | number;
  title: string;
  address: string;
  img: string;
  price: number;
  featured: boolean;
  status: string;
  specs: { area: number; offices: number; baths: number; lounge: boolean; garage: number };
  date: string;
  category: string;
  propertyType: string;
};

const CARDS: CardData[] = [];

function Badge({ children, color }: { children: React.ReactNode; color: "yellow" | "black" }) {
  const styles =
    color === "yellow"
      ? "bg-yellow-400 text-[#0a265e]"
      : "bg-black text-white";
  return (
    <span className={`rounded px-2 py-1 text-[11px] font-semibold ${styles}`}>
      {children}
    </span>
  );
}

function Stat({ label }: { label: string }) {
  return <div className="text-xs text-zinc-600">{label}</div>;
}

const nf = new Intl.NumberFormat("en-IN");

function Card({
  item,
  isFavorite,
  onToggle,
}: {
  item: CardData;
  isFavorite: boolean;
  onToggle: (id: string | number) => void;
}) {
  const handleShare = async () => {
    const shareData = {
      title: item.title,
      text: `Check out this property: ${item.title} in ${item.address}`,
      url: `${window.location.origin}/rooms/${item.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
      <div className="relative">
        <Link href={`/rooms/${item.id}`} className="block overflow-hidden rounded-t-xl">
          <Image
            src={item.img}
            alt={item.title}
            width={600}
            height={400}
            className="h-52 w-full object-cover"
            loading="lazy"
            fetchPriority="low"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {item.featured && <Badge color="black">Featured</Badge>}
          <Badge color="yellow">{item.status}</Badge>
        </div>
        <div className="absolute bottom-3 right-3 rounded bg-[#113b8f] px-3 py-1 text-sm font-semibold text-white">
          ₹{nf.format(item.price)} Per Month
        </div>
      </div>
      <div className="p-4">
        <div className="text-lg font-semibold text-zinc-900">{item.title}</div>
        <div className="mt-1 text-sm text-zinc-600">{item.address}</div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-zinc-700 sm:grid-cols-3">
          <Stat label={`${nf.format(item.specs.area)} sq ft`} />
          <Stat label={`${item.specs.offices} Office Rooms`} />
          <Stat label={`${item.specs.baths} Bathroom`} />
          <Stat label={`TV Lounge`} />
          <Stat label={`${item.specs.garage} Garage`} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-600">
        <span>{item.date}</span>
        <div className="flex items-center gap-3">
          <button
            aria-label="Save"
            className={`transition-all active:scale-125 hover:scale-110 ${
              isFavorite ? "text-rose-600" : "text-zinc-400 hover:text-rose-600"
            }`}
            onClick={() => onToggle(item.id)}
          >
            <span className="text-2xl">{isFavorite ? "❤️" : "♡"}</span>
          </button>
          <button
            aria-label="Share"
            className="text-zinc-400 hover:text-zinc-800 transition-colors"
            onClick={handleShare}
          >
            <span className="text-xl">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesSection() {
  const [active, setActive] = useState<TabKey>("latest");
  const [latest, setLatest] = useState<CardData[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const locationParam = (searchParams.get("location") || "").toLowerCase().trim();
  const tabParam = searchParams.get("tab") as TabKey | null;
  const [userId, setUserId] = useState<string | null>(null);
  const [visible, setVisible] = useState(6);

  useEffect(() => {
    if (tabParam && TABS.some(t => t.key === tabParam)) {
      setActive(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    setVisible(6);
  }, [active, q, locationParam]);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserId(u?.uid || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!db) return;
    if (!userId) {
      Promise.resolve().then(() => setFavorites([]));
      return;
    }
    const q = query(collection(db, `users/${userId}/favorites`));
    const unsub = onSnapshot(q, (snap) => {
      setFavorites(snap.docs.map((d) => d.id));
    });
    return () => unsub();
  }, [userId]);

  const toggleFavorite = async (id: string | number) => {
    if (!userId || !db) {
      alert("Please login to save favorites!");
      return;
    }
    const docId = String(id);
    const favRef = doc(db, `users/${userId}/favorites`, docId);
    try {
      if (favorites.includes(docId)) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          addedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error("Fav toggle failed:", e);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("/api/rooms");
        if (res.ok) {
          const data = await res.json();
          const items: CardData[] = data.map((v: any) => {
            return {
              id: v.id,
              title: v.title || "Room",
              address: v.city || "—",
              img: v.photos?.[0] || "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop",
              price: Number(v.rent) || 0,
              featured: false,
              status: "For Rent",
              specs: { 
                area: Number(v.carpetArea) || 0, 
                offices: Number(v.bedrooms) || 0, 
                baths: Number(v.bathrooms) || 0, 
                lounge: true, 
                garage: 0 
              },
              date: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "Recently",
              category: "rent",
              propertyType: v.propertyType || "Room",
            };
          });
          setLatest(items);
        }
      } catch (e) {
        console.log("Fetch rooms failed:", e);
      }
    };
    fetchRooms();
  }, []);

  const dataToFilter = latest;
  const base =
    active === "latest"
      ? dataToFilter
      : dataToFilter.filter((c) => c.propertyType === active);
  const filtered = q || locationParam
    ? base.filter(
        (c) =>
          (q ? (c.title.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)) : true) &&
          (locationParam ? c.address.toLowerCase().includes(locationParam) : true)
      )
    : base;
  const toShow = filtered.slice(0, visible);

  return (
    <section id="properties" className="bg-[#FFF5E1] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-wide text-zinc-800 sm:text-3xl uppercase">
            MKSUKO PROPERTIES
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            We have Properties in these Areas. View a list of Featured Properties.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`border-b-2 pb-2 text-sm font-semibold ${
                active === t.key
                  ? "border-[#113b8f] text-[#113b8f]"
                  : "border-transparent text-zinc-600 hover:text-zinc-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {toShow.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {toShow.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  isFavorite={favorites.includes(String(item.id))}
                  onToggle={toggleFavorite}
                />
              ))}
            </div>
            {filtered.length > visible && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisible((v) => v + 6)}
                  className="rounded-full bg-[#113b8f] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#0d3278]"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="text-4xl text-zinc-400">🏘️</div>
            <h3 className="mt-4 text-xl font-bold text-zinc-800">No Properties Found</h3>
            <p className="mt-2 text-zinc-600">
              We couldn&apos;t find any properties matching your criteria in this section.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
