"use client";
import { useState, useEffect, Suspense } from "react";
import { db, auth, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, doc, updateDoc, getFirestore, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { useRouter, useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

const groups = [
  {
    label: "Balconies",
    options: ["0", "1", "2", "3", "3+"],
  },
  {
    label: "Floor No.",
    options: [
      "Ground",
      "1",
      "2",
      "3",
      "4",
      "5",
      "5+",
    ],
  },
  {
    label: "Total Floors",
    options: ["1","2","3","4","5","5+"],
  },
  {
    label: "Furnished Status",
    options: ["Furnished", "Unfurnished", "Semi-Furnished"],
  },
];

function Chip({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`rounded border px-3 py-2 text-sm ${
        active
          ? "border-rose-300 bg-rose-50 text-rose-700"
          : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function FeaturesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<string>("");
  const [balconies, setBalconies] = useState<string>("");
  const [floorNo, setFloorNo] = useState<string>("");
  const [totalFloors, setTotalFloors] = useState<string>("");
  const [furnishedStatus, setFurnishedStatus] = useState<string>("");
  const [carpetArea, setCarpetArea] = useState<string>("");
  const [carpetUnit, setCarpetUnit] = useState<string>("Sq-ft");
  const [superArea, setSuperArea] = useState<string>("");
  const [superUnit, setSuperUnit] = useState<string>("Sq-ft");
  const [rent, setRent] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showUploader, setShowUploader] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string>("");
  const [uploadType, setUploadType] = useState<"photo" | "video">("photo");

  useEffect(() => {
    if (roomId && db) {
      const fetchRoom = async () => {
        try {
          const snap = await getDoc(doc(db!, "rooms", roomId));
          if (snap.exists()) {
            const data = snap.data();
            setBedrooms(data.bedrooms || "");
            setBathrooms(data.bathrooms || "");
            setBalconies(data.balconies || "");
            setFloorNo(data.floorNo || "");
            setTotalFloors(data.totalFloors || "");
            setFurnishedStatus(data.furnishedStatus || "");
            setCarpetArea(data.carpetArea || "");
            setCarpetUnit(data.carpetUnit || "Sq-ft");
            setSuperArea(data.superArea || "");
            setSuperUnit(data.superUnit || "Sq-ft");
            setRent(data.rent || "");
            setDeposit(data.deposit || "");
          }
        } catch (e) {
          console.error("Failed to fetch room:", e);
        }
      };
      fetchRoom();
    }
  }, [roomId]);

  const saveToFirestore = async () => {
    try {
      const draft = JSON.parse(localStorage.getItem("roomDraft") || "{}");
      const base = {
        ...draft,
        bedrooms,
        bathrooms,
        balconies,
        floorNo,
        totalFloors,
        furnishedStatus,
        carpetArea,
        carpetUnit,
        superArea,
        superUnit,
        rent,
        deposit,
        uid: auth?.currentUser?.uid || null,
      };
      let useDb = db;
      if (!useDb) {
        const cfgOk =
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
        if (!cfgOk) throw new Error("Firebase not ready");
        const cfg = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
        };
        const app = getApps().length ? getApp() : initializeApp(cfg);
        useDb = getFirestore(app);
      }
      const id = searchParams.get("id") || localStorage.getItem("roomDocId");
      if (id) {
        const d = doc(useDb, "rooms", id);
        await setDoc(d, base, { merge: true });
      }
      else {
        const ref = await addDoc(collection(useDb, "rooms"), { ...base, createdAt: serverTimestamp() });
        localStorage.setItem("roomDocId", ref.id);
      }
      localStorage.removeItem("roomDraft");
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
      router.push("/");
    }
  };
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Property Features</h1>
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">Bedrooms</div>
              <div className="flex flex-wrap gap-2">
                {["1", "2", "3", "4", "5+"].map((o) => (
                  <Chip key={o} active={bedrooms === o} onClick={() => setBedrooms(o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">Bathrooms</div>
              <div className="flex flex-wrap gap-2">
                {["1","2","3","3+"].map((o) => (
                  <Chip key={o} active={bathrooms === o} onClick={() => setBathrooms(o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.label}>
              <div className="mb-2 text-sm font-medium text-zinc-700">{g.label}</div>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const selected =
                    g.label === "Balconies"
                      ? balconies === o
                      : g.label === "Floor No."
                      ? floorNo === o
                      : g.label === "Total Floors"
                      ? totalFloors === o
                      : g.label === "Furnished Status"
                      ? furnishedStatus === o
                      : false;
                  const click = () => {
                    if (g.label === "Balconies") setBalconies(o);
                    else if (g.label === "Floor No.") setFloorNo(o);
                    else if (g.label === "Total Floors") setTotalFloors(o);
                    else if (g.label === "Furnished Status") setFurnishedStatus(o);
                  };
                  return (
                    <Chip key={o} active={selected} onClick={click}>
                      {o}
                    </Chip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">Area</h2>
          <p className="text-sm text-zinc-600">
            Provide either Carpet Area or Super Area
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">
                Carpet Area
              </div>
              <div className="grid grid-cols-[1fr,120px] gap-2">
                <input
                  placeholder="Carpet Area"
                  className="rounded-md border-b border-zinc-300 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(e.target.value)}
                />
                <select className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm" value={carpetUnit} onChange={(e)=>setCarpetUnit(e.target.value)}>
                  <option>Sq-ft</option>
                  <option>Sq-m</option>
                  <option>Sq-yd</option>
                </select>
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">
                Super Area
              </div>
              <div className="grid grid-cols-[1fr,120px] gap-2">
                <input
                  placeholder="Super Area"
                  className="rounded-md border-b border-zinc-300 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                  value={superArea}
                  onChange={(e) => setSuperArea(e.target.value)}
                />
                <select className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm" value={superUnit} onChange={(e)=>setSuperUnit(e.target.value)}>
                  <option>Sq-ft</option>
                  <option>Sq-m</option>
                  <option>Sq-yd</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-900">Rent/ Lease Details</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">
                Monthly Rent
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-2.5 text-sm text-zinc-500">₹</span>
                <input
                  placeholder="Enter Total Rent"
                  className="w-full rounded-md border-b border-zinc-300 pl-6 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                  value={rent}
                  onChange={(e)=>setRent(e.target.value)}
                />
              </div>
              <label className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
                Rent Negotiable
              </label>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">
                Security Amount (optional)
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-2.5 text-sm text-zinc-500">₹</span>
                <input
                  placeholder="Security Amount"
                  className="w-full rounded-md border-b border-zinc-300 pl-6 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                  value={deposit}
                  onChange={(e)=>setDeposit(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">
                Maintenance Charges
              </div>
              <div className="grid grid-cols-[1fr,140px] gap-2">
                <div className="relative">
                  <span className="pointer-events-none absolute left-2 top-2.5 text-sm text-zinc-500">₹</span>
                  <input
                    placeholder="Maintenance Charges"
                    className="w-full rounded-md border-b border-zinc-300 pl-6 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                  />
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-700">per</div>
                  <select className="w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm">
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-900">Photos</h2>
          <p className="mt-1 text-sm text-zinc-600">
            It&apos;s Optional! But, don&apos;t forget to upload them later.
          </p>
          <div className="mt-4 border-b border-zinc-200">
            <div className="flex flex-wrap gap-4">
              {[
                "Exterior View",
                "Living Room",
                "Bedrooms",
                "Bathrooms",
                "Kitchen",
                "Floor Plan",
                "Master Plan",
                "Location Map",
                "Others",
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`border-b-2 pb-2 text-sm ${
                    t === "Others"
                      ? "border-rose-600 font-medium text-rose-700"
                      : "border-transparent text-zinc-600 hover:text-zinc-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 rounded-lg border-2 border-dashed border-zinc-300 p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-3 rounded-full bg-amber-100 px-6 py-4">
                <div className="grid place-items-center rounded-full bg-white p-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 5h16a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6a1 1 0 0 1 1-1z" stroke="#ea580c" strokeWidth="1.5"/>
                    <path d="M3 14l5-5 5 6 3-3 5 6" stroke="#ea580c" strokeWidth="1.5"/>
                    <circle cx="9" cy="8" r="1.5" fill="#ea580c"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm text-amber-900">
                    <span className="font-semibold">85% of </span>
                    <span className="font-semibold text-rose-700">Tenants</span> enquire on Properties with Photos
                  </div>
                  <div className="text-xs text-amber-900">
                    Upload Photos & Get upto <span className="font-semibold text-rose-700">10X more Enquiries</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setUploadType("photo");
                    setShowUploader(true);
                  }}
                  className="inline-flex items-center rounded-full border-2 border-rose-600 px-6 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  Add Photos Now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadType("video");
                    setShowUploader(true);
                  }}
                  className="ml-3 inline-flex items-center rounded-full border-2 border-rose-600 px-6 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  Add Videos Now
                </button>
              </div>
            </div>
          </div>
          {showUploader && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
              <div className="w-[90vw] max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-zinc-900">{uploadType === "photo" ? "Upload Photos" : "Upload Videos"}</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  {uploadType === "photo" ? "Supported: JPG, PNG. You can select multiple files." : "Supported: MP4. You can select multiple files."}
                </p>
                <div className="mt-4">
                  <input
                    type="file"
                    accept={uploadType === "photo" ? "image/*" : "video/*"}
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full"
                  />
                  {files && files.length ? (
                    <div className="mt-3 max-h-40 overflow-auto rounded border border-zinc-200 p-2 text-xs text-zinc-700">
                      {Array.from(files).map((f) => (
                        <div key={f.name} className="truncate">{f.name}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={uploading}
                    className="rounded-md bg-[#113b8f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    onClick={async () => {
                      try {
                        setUploading(true);
                        setUploadMsg("");
                        const id = searchParams.get("id") || localStorage.getItem("roomDocId");
                        let useDb = db;
                        let useStorage = storage;
                        if (!useDb || !useStorage) {
                          const cfgOk =
                            process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
                            process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
                            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
                            process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
                          if (!cfgOk) throw new Error("Firebase not ready");
                          const cfg = {
                            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
                            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
                            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
                            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
                          };
                          const app = getApps().length ? getApp() : initializeApp(cfg);
                          useDb = getFirestore(app);
                          useStorage = getStorage(app);
                        }
                        if (!id) throw new Error("Room not initialized");
                        if (!files || !files.length) throw new Error("Select files first");
                        const folder = `rooms/${id}`;
                        const urls: { photos: string[]; videos: string[] } = { photos: [], videos: [] };
                        for (const f of Array.from(files)) {
                          const objectRef = ref(useStorage!, `${folder}/${Date.now()}-${f.name}`);
                          await uploadBytes(objectRef, f);
                          const url = await getDownloadURL(objectRef);
                          if (uploadType === "photo") {
                            if (!f.type.startsWith("image/")) continue;
                            urls.photos.push(url);
                          } else {
                            if (!f.type.startsWith("video/")) continue;
                            urls.videos.push(url);
                          }
                        }
                        const target = doc(useDb!, "rooms", id);
                        const updates: Record<string, unknown> = {};
                        urls.photos.forEach((u) => (updates.photos = arrayUnion(u)));
                        urls.videos.forEach((u) => (updates.videos = arrayUnion(u)));
                        if (updates.photos || updates.videos) {
                          await updateDoc(target, updates);
                        }
                        setUploadMsg("Upload complete");
                      } catch (e: unknown) {
                        setUploadMsg(e instanceof Error ? e.message : "Upload failed");
                      } finally {
                        setUploading(false);
                      }
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800"
                    onClick={() => {
                      setShowUploader(false);
                      setFiles(null);
                      setUploadMsg("");
                    }}
                  >
                    Close
                  </button>
                  {uploadMsg ? <span className="text-xs text-zinc-700">{uploadMsg}</span> : null}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={saveToFirestore}
            className="inline-flex items-center justify-center rounded-md bg-rose-600 px-8 py-3 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Save &amp; Continue
          </button>
        </div>
        {error ? <div className="mt-4 text-center text-sm text-rose-600">{error}</div> : null}
      </div>
    </main>
  );
}

export default function FeaturesPage() {
  return (
    <Suspense fallback={null}>
      <FeaturesPageInner />
    </Suspense>
  );
}
