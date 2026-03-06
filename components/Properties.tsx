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
  getFirestore,
  setDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getApps, getApp, initializeApp } from "firebase/app";

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

const CARDS: CardData[] = [
  {
    id: 1,
    title: "Park Avenue Apartment",
    address: "45 Regent Street, London, UK",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80&auto=format&fit=crop",
    price: 8600,
    featured: true,
    status: "For Sale",
    specs: { area: 4800, offices: 2, baths: 1, lounge: true, garage: 1 },
    date: "5 Days ago",
    category: "sale",
    propertyType: "Flat",
  },
  {
    id: 2,
    title: "Park Avenue Apartment",
    address: "45 Regent Street, London, UK",
    img: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop",
    price: 8600,
    featured: false,
    status: "For Rent",
    specs: { area: 4800, offices: 2, baths: 1, lounge: true, garage: 1 },
    date: "5 Days ago",
    category: "rent",
    propertyType: "Room",
  },
  {
    id: 3,
    title: "Modern PG for Students",
    address: "Oxford Street, London, UK",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop",
    price: 1200,
    featured: true,
    status: "For Rent",
    specs: { area: 1200, offices: 1, baths: 1, lounge: false, garage: 0 },
    date: "2 Days ago",
    category: "rent",
    propertyType: "PG",
  },
  {
    id: 4,
    title: "Residential Plot in Suburb",
    address: "Green Valley, London, UK",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop",
    price: 45000,
    featured: false,
    status: "For Sale",
    specs: { area: 5000, offices: 0, baths: 0, lounge: false, garage: 0 },
    date: "1 Week ago",
    category: "sale",
    propertyType: "Plot",
  },
];

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

const nf = new Intl.NumberFormat("en-US");

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
          ${nf.format(item.price)} Per Month
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
  }, [active, q]);

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
    let ignore = false;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        let useDb = db;
        if (!useDb) {
          const cfgOk =
            process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
            process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
            process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
          if (!cfgOk) return;
          const cfg = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
          };
          const app = getApps().length ? getApp() : initializeApp(cfg);
          useDb = getFirestore(app);
        }
        const qy = query(collection(useDb, "rooms"), orderBy("createdAt", "desc"));
        unsubscribe = onSnapshot(qy, (snap) => {
          const num = (v: unknown, def = 0) => {
            if (typeof v === "number") return v;
            if (typeof v === "string") {
              const m = v.match(/\d+/);
              return m ? Number(m[0]) : def;
            }
            return def;
          };
          const items: CardData[] = snap.docs.map((d) => {
            const v = d.data() as Record<string, unknown>;
            const created =
              v.createdAt instanceof Timestamp ? v.createdAt.toDate() : new Date();
            const photos = Array.isArray(v.photos) ? (v.photos as unknown[]).filter((x) => typeof x === "string") as string[] : [];
            return {
              id: d.id,
              title:
                typeof v.title === "string" && v.title.length
                  ? v.title
                  : typeof v.project === "string" && v.project.length
                  ? v.project
                  : "Room",
              address:
                typeof v.city === "string" && v.city.length ? v.city : "—",
              img:
                photos.length
                  ? photos[0]
                  : "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop",
              price:
                num(v.rent, 0),
              featured: false,
              status: "For Rent",
              specs: {
                area: num(v.superArea, num(v.carpetArea, 0)),
                offices: num(v.bedrooms, 1),
                baths: num(v.bathrooms, 1),
                lounge: true,
                garage: 1,
              },
              date: created.toLocaleDateString(),
              category: "latest",
              propertyType: typeof v.propertyType === "string" ? v.propertyType : "",
            };
          });
          if (!ignore) setLatest(items);
        });
      } catch {}
    })();
    return () => {
      ignore = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const dataToFilter = latest.length ? latest : CARDS;
  const base =
    active === "latest"
      ? dataToFilter
      : dataToFilter.filter((c) => c.propertyType === active);
  const filtered = q
    ? base.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
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
      </div>
    </section>
  );
}
