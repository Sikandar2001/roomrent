"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, getFirestore, Timestamp } from "firebase/firestore";
import { getApps, getApp, initializeApp } from "firebase/app";

type RoomDoc = {
  title?: string;
  description?: string;
  project?: string;
  city?: string;
  rent?: number | string;
  deposit?: number | string;
  superArea?: number | string;
  carpetArea?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  balconies?: number | string;
  totalFloors?: number | string;
  floorNo?: number | string;
  furnishedStatus?: string;
  propertyType?: string;
  ownerType?: string;
  phone?: string;
  photos?: string[];
  createdAt?: Timestamp;
};

export default function RoomDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // const router = useRouter();
  const [data, setData] = useState<RoomDoc | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
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
        const snap = await getDoc(doc(useDb, "rooms", id));
        if (snap.exists()) {
          const v = snap.data() as RoomDoc;
          setData(v);
        }
      } catch {}
    })();
  }, [id]);

  const photos =
    (data?.photos?.filter((p) => typeof p === "string") as string[] | undefined) ??
    ["https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop"];

  const price =
    typeof data?.rent === "string" || typeof data?.rent === "number"
      ? Number(data?.rent)
      : 0;

  const nf = new Intl.NumberFormat("en-US");

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 bg-[#FFF5E1]">
      <Link href="/" className="text-sm text-[#113b8f] hover:underline">
        ← Back to Home
      </Link>
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1 border-b border-zinc-100 pb-4 md:flex-row md:items-center md:justify-between md:pb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {data?.title || data?.project || "Room"}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">{data?.city || "—"}</p>
          </div>
          <div className="mt-2 inline-block w-fit rounded bg-[#113b8f] px-4 py-2 text-lg font-bold text-white md:mt-0">
            ₹{nf.format(price)} <span className="text-xs font-normal opacity-80">/ month</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Main Image, Details, Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="overflow-hidden rounded-2xl shadow-sm border border-zinc-100">
              <Image
                src={photos[idx]}
                alt={data?.project || "Room"}
                width={1200}
                height={900}
                className="h-[300px] w-full object-cover sm:h-[450px]"
                priority
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Basic Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Carpet Area:</span> 
                    <span className="font-semibold text-zinc-900">{data?.carpetArea || data?.superArea || "—"} sq ft</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Bedrooms:</span> 
                    <span className="font-semibold text-zinc-900">{data?.bedrooms || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Bathrooms:</span> 
                    <span className="font-semibold text-zinc-900">{data?.bathrooms || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Balconies:</span> 
                    <span className="font-semibold text-zinc-900">{data?.balconies || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Floor:</span> 
                    <span className="font-semibold text-zinc-900">{data?.floorNo || "—"} / {data?.totalFloors || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Furnished Status:</span> 
                    <span className="font-semibold text-zinc-900">{data?.furnishedStatus || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Property Type:</span> 
                    <span className="font-semibold text-zinc-900">{data?.propertyType || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Owner Type:</span> 
                    <span className="font-semibold text-zinc-900">{data?.ownerType || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Deposit:</span> 
                    <span className="font-semibold text-emerald-600">{data?.deposit ? `₹${nf.format(Number(data.deposit))}` : "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Posted:</span> 
                    <span className="font-semibold text-zinc-900">{data?.createdAt ? data.createdAt.toDate().toLocaleDateString() : "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {data?.description && (
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Property Description</h3>
                <div className="text-sm leading-relaxed text-zinc-700 whitespace-pre-line">
                  {data.description}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Thumbnails and Contact */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Photos</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                {photos.slice(0, 4).map((u, i) => (
                  <button
                    key={u + i}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${idx === i ? "border-[#113b8f] ring-2 ring-[#113b8f]/10" : "border-transparent hover:border-zinc-300"}`}
                    onClick={() => setIdx(i)}
                  >
                    <Image src={u} alt="thumb" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </button>
                ))}
              </div>
            </div>

            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md ring-1 ring-black/5">
              <div className="mb-6 border-b border-zinc-100 pb-4 text-center">
                <p className="text-sm font-medium text-zinc-500">Interested in this property?</p>
              </div>
              <div className="flex flex-col gap-3">
                {data?.phone ? (
                  <a 
                    href={`tel:${data.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l.54 2.157a1.912 1.912 0 01-.44 1.833l-1.147 1.147a1.208 1.208 0 00-.387 1.088 11.762 11.762 0 005.406 5.406 1.208 1.208 0 001.088-.387l1.147-1.147a1.911 1.911 0 011.833-.44l2.157.54a1.912 1.912 0 011.42 1.819V19.5a3 3 0 01-3 3h-2.25a16.5 16.5 0 01-16.5-16.5V4.5z" />
                    </svg>
                    Contact Owner
                  </a>
                ) : (
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center rounded-xl bg-rose-600 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-700 active:scale-95"
                  >
                    Contact Owner
                  </Link>
                )}
                <button className="flex items-center justify-center rounded-xl border border-zinc-200 py-4 text-sm font-bold text-zinc-800 transition-all hover:bg-zinc-50 active:scale-95">
                  Download Brochure
                </button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-[10px] text-zinc-400">Your information is safe with us.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
