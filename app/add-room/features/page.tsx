"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
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
          ? "border-blue-300 bg-blue-50 text-blue-700"
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
  const [maintenanceCharge, setMaintenanceCharge] = useState<string>("");
  const [maintenancePeriod, setMaintenancePeriod] = useState<string>("Monthly");
  const [error, setError] = useState<string>("");
  const [showUploader, setShowUploader] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadMsg, setUploadMsg] = useState<string>("");
  const [uploadType, setUploadType] = useState<"photo" | "video">("photo");
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showUploader && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [showUploader]);

  useEffect(() => {
    if (roomId) {
      const fetchRoom = async () => {
        try {
          const res = await fetch(`/api/rooms?id=${roomId}`);
          if (res.ok) {
            const data = await res.json();
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
            setMaintenanceCharge(data.maintenanceCharge || "");
            setMaintenancePeriod(data.maintenancePeriod || "Monthly");
            setExistingPhotos(data.photos || []);
            setExistingVideos(data.videos || []);
          }
        } catch (e) {
          console.log("Failed to fetch room:", e);
        }
      };
      fetchRoom();
    }
  }, [roomId]);

  const saveToFirestore = async () => {
    if (!bedrooms || !bathrooms || !rent || !deposit || !maintenanceCharge) {
      setError("Please fill all mandatory fields (marked with *).");
      return;
    }
    setError("");
    try {
      const base = {
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
        maintenanceCharge,
        maintenancePeriod,
        uid: auth?.currentUser?.uid || null,
      };
      
      const id = searchParams.get("id") || localStorage.getItem("roomDocId");
      if (id) {
        await fetch(`/api/rooms?id=${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(base),
        });
      }
      localStorage.removeItem("roomDocId");
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
      console.log("Save error:", e);
    }
  };
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Property Features</h1>
        <div className="mt-6 space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">Bedrooms <span className="text-red-500">*</span></div>
              <div className="flex flex-wrap gap-2">
                {["1", "2", "3", "4", "5+"].map((o) => (
                  <Chip key={o} active={bedrooms === o} onClick={() => {
                    setBedrooms(o);
                    if (o && bathrooms) setError("");
                  }}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">Bathrooms <span className="text-red-500">*</span></div>
              <div className="flex flex-wrap gap-2">
                {["1","2","3","3+"].map((o) => (
                  <Chip key={o} active={bathrooms === o} onClick={() => {
                    setBathrooms(o);
                    if (o && bedrooms) setError("");
                  }}>
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
                Monthly Rent <span className="text-red-500">*</span>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-2.5 text-sm text-zinc-500">₹</span>
                <input
                  placeholder="Enter Total Rent"
                  className="w-full rounded-md border-b border-zinc-300 pl-6 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                  value={rent}
                  onChange={(e) => {
                    setRent(e.target.value);
                    if (e.target.value && bathrooms && bedrooms && deposit && maintenanceCharge) setError("");
                  }}
                />
              </div>
              <label className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" />
                Rent Negotiable
              </label>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">
                Security Amount <span className="text-red-500">*</span>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-2 top-2.5 text-sm text-zinc-500">₹</span>
                <input
                  placeholder="Security Amount"
                  className="w-full rounded-md border-b border-zinc-300 pl-6 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                  value={deposit}
                  onChange={(e) => {
                    setDeposit(e.target.value);
                    if (e.target.value && bathrooms && bedrooms && rent && maintenanceCharge) setError("");
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-zinc-700">
                Maintenance Charges <span className="text-red-500">*</span>
              </div>
              <div className="grid grid-cols-[1fr,140px] gap-2">
                <div className="relative">
                  <span className="pointer-events-none absolute left-2 top-2.5 text-sm text-zinc-500">₹</span>
                  <input
                    placeholder="Maintenance Charges"
                    className="w-full rounded-md border-b border-zinc-300 pl-6 px-1 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                    value={maintenanceCharge}
                    onChange={(e) => {
                      setMaintenanceCharge(e.target.value);
                      if (e.target.value && bathrooms && bedrooms && rent && deposit) setError("");
                    }}
                  />
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-700">per <span className="text-red-500">*</span></div>
                  <select
                    className="w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm"
                    value={maintenancePeriod}
                    onChange={(e) => setMaintenancePeriod(e.target.value)}
                  >
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
                      ? "border-blue-600 font-medium text-blue-700"
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
              {/* Show Previews of existing photos/videos */}
              {(existingPhotos.length > 0 || existingVideos.length > 0) && (
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {existingPhotos.map((url, idx) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200 group">
                      <img src={url} alt={`Photo ${idx}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={async () => {
                          const id = searchParams.get("id") || localStorage.getItem("roomDocId");
                          if (id) {
                            const newPhotos = existingPhotos.filter((p) => p !== url);
                            await fetch(`/api/rooms?id=${id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ photos: newPhotos }),
                            });
                            setExistingPhotos(newPhotos);
                          }
                        }}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  {existingVideos.map((url, idx) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200 group bg-black flex items-center justify-center">
                      <video src={url} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const id = searchParams.get("id") || localStorage.getItem("roomDocId");
                          if (id) {
                            const newVideos = existingVideos.filter((v) => v !== url);
                            await fetch(`/api/rooms?id=${id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ videos: newVideos }),
                            });
                            setExistingVideos(newVideos);
                          }
                        }}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType("photo");
                      setShowUploader(true);
                    }}
                    className="inline-flex items-center rounded-full border-2 border-blue-600 px-6 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Add Photos Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType("video");
                      setShowUploader(true);
                    }}
                    className="inline-flex items-center rounded-full border-2 border-blue-600 px-6 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Add Videos Now
                  </button>
                </div>
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
                    ref={fileInputRef}
                    accept={uploadType === "photo" ? "image/*" : "video/*"}
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files);
                        setFiles((prev) => (prev ? [...prev, ...newFiles] : newFiles));
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-8 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    <span className="font-medium">
                      {files && files.length ? `${files.length} files selected` : "Select Files"}
                    </span>
                  </button>
                          {files && files.length ? (
                    <div className="mt-3 grid grid-cols-4 gap-2 max-h-60 overflow-auto rounded border border-zinc-200 p-2">
                      {Array.from(files).map((f, i) => (
                        <div key={i} className="relative aspect-square bg-zinc-100 rounded overflow-hidden">
                          {uploadType === "photo" ? (
                            <img src={URL.createObjectURL(f)} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-zinc-500 break-all p-1">{f.name}</div>
                          )}
                          {uploadProgress[f.name] !== undefined && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white">{Math.round(uploadProgress[f.name])}%</span>
                            </div>
                          )}
                        </div>
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
                        setUploadProgress({});
                        const id = searchParams.get("id") || localStorage.getItem("roomDocId");
                        
                        if (!id) throw new Error("Room not initialized");
                        if (!files || !files.length) throw new Error("Select files first");
                        const folder = `rooms/${id}`;
                        const uploadedUrls: string[] = [];
                        
                        const uploadPromises = Array.from(files).map(async (f) => {
                          if (uploadType === "photo" && !f.type.startsWith("image/")) {
                            return "";
                          }
                          if (uploadType === "video" && !f.type.startsWith("video/")) {
                            return "";
                          }

                          const formData = new FormData();
                          formData.append("file", f);
                          formData.append("folder", folder);

                          const res = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          });

                          if (!res.ok) {
                            const err = await res.json();
                            throw new Error(err.error || "Upload failed");
                          }

                          const data = await res.json();
                          return data.url;
                        });

                        const results = await Promise.all(uploadPromises);
                        const newUrls = results.filter(url => url !== "");
                        uploadedUrls.push(...newUrls);

                        if (uploadedUrls.length > 0) {
                          const field = uploadType === "photo" ? "photos" : "videos";
                          const currentUrls = uploadType === "photo" ? existingPhotos : existingVideos;
                          const updatedList = [...currentUrls, ...uploadedUrls];
                          
                          await fetch(`/api/rooms?id=${id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ [field]: updatedList }),
                          });
                          
                          if (uploadType === "photo") {
                            setExistingPhotos(updatedList);
                          } else {
                            setExistingVideos(updatedList);
                          }
                        }

                        setUploadMsg("Upload complete");
                        setTimeout(() => {
                          setShowUploader(false);
                          setFiles(null);
                          setUploadMsg("");
                          setUploadProgress({});
                        }, 1500);
                      } catch (e: any) {
                        console.error("Upload Error:", e);
                        setUploadMsg(`Upload failed: ${e.message || "unknown error"}`);
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
            className="inline-flex items-center justify-center rounded-md bg-[#113b8f] px-8 py-3 text-sm font-semibold text-white hover:bg-[#0d3278]"
          >
            Save & Continue
          </button>
        </div>
        {error ? <div className="mt-4 text-center text-sm text-blue-600">{error}</div> : null}
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
