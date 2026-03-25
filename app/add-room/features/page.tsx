"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { X, LogIn } from "lucide-react";

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
        active
          ? "bg-[#113b8f] text-white shadow-lg shadow-blue-100 ring-2 ring-blue-600 ring-offset-1"
          : "bg-white text-zinc-700 border border-zinc-200 hover:border-blue-600 hover:text-blue-600 active:scale-95"
      }`}
    >
      {children}
    </button>
  );
}

const groups = [
  {
    label: "Balconies",
    options: ["1", "2", "3", "3+"],
  },
  {
    label: "Floor No.",
    options: ["1", "2", "3", "4", "5+"],
  },
  {
    label: "Total Floors",
    options: ["1", "2", "3", "4", "5+"],
  },
  {
    label: "Furnished Status",
    options: ["Furnished", "Unfurnished", "Semi-Furnished"],
  },
];

const AREA_UNITS = [
  "Sq-ft",
  "Sq.yrd",
  "Gaj",
  "Sq.m",
  "Acres",
  "Marla",
  "Cents",
  "Bigha",
  "Kottah",
  "Ground",
  "Ares",
  "Biswa",
  "Guntha",
  "Aankadam",
  "Hectares",
  "Rood",
  "Chataks",
  "Perch",
];

function FeaturesPageInner() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const router = useRouter();
  const [error, setError] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [customBedrooms, setCustomBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [customBathrooms, setCustomBathrooms] = useState("");
  const [balconies, setBalconies] = useState("");
  const [customBalconies, setCustomBalconies] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [customFloorNo, setCustomFloorNo] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [customTotalFloors, setCustomTotalFloors] = useState("");
  const [furnishedStatus, setFurnishedStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState(""); // Sell or Rent
  const [plotArea, setPlotArea] = useState("");
  const [plotUnit, setPlotUnit] = useState("sq.ft.");
  const [plotLength, setPlotLength] = useState("");
  const [plotBreadth, setPlotBreadth] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [carpetUnit, setCarpetUnit] = useState("Sq-ft");
  const [superArea, setSuperArea] = useState("");
  const [superUnit, setSuperUnit] = useState("Sq-ft");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [maintenanceCharge, setMaintenanceCharge] = useState("");
  const [maintenancePeriod, setMaintenancePeriod] = useState("Monthly");
  const [allInclusivePrice, setAllInclusivePrice] = useState(false);
  const [taxChargesExcluded, setTaxChargesExcluded] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [priceUnit, setPriceUnit] = useState("Month");
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [uploadType, setUploadType] = useState<"photo" | "video">("photo");
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const id = roomId || localStorage.getItem("roomDocId");
    if (id) {
      const fetchRoom = async () => {
        try {
          const res = await fetch(`/api/rooms?id=${id}`);
          if (res.ok) {
            const data = await res.json();
            const b = data.bedrooms;
            if (["1", "2", "3", "4"].includes(b)) {
              setBedrooms(b);
            } else if (b) {
              setBedrooms("5+");
              setCustomBedrooms(b);
            }
            const bt = data.bathrooms;
            if (["1", "2", "3"].includes(bt)) {
              setBathrooms(bt);
            } else if (bt) {
              setBathrooms("3+");
              setCustomBathrooms(bt);
            }
            const bl = data.balconies;
            if (["1", "2", "3"].includes(bl)) {
              setBalconies(bl);
            } else if (bl) {
              setBalconies("3+");
              setCustomBalconies(bl);
            }
            const fn = data.floorNo;
            if (["1", "2", "3", "4"].includes(fn)) {
              setFloorNo(fn);
            } else if (fn) {
              setFloorNo("5+");
              setCustomFloorNo(fn);
            }
            const tf = data.totalFloors;
            if (["1", "2", "3", "4"].includes(tf)) {
              setTotalFloors(tf);
            } else if (tf) {
              setTotalFloors("5+");
              setCustomTotalFloors(tf);
            }

            setFurnishedStatus(data.furnishedStatus || "");
            setPropertyType(data.propertyType || "");
            setListingType(data.listingType || "");
            setPlotArea(data.plotArea || "");
            setPlotUnit(data.plotUnit || "sq.ft.");
            setPlotLength(data.plotLength || "");
            setPlotBreadth(data.plotBreadth || "");
            setCarpetArea(data.carpetArea || "");
            setCarpetUnit(data.carpetUnit || "Sq-ft");
            setSuperArea(data.superArea || "");
            setSuperUnit(data.superUnit || "Sq-ft");
            setRent(data.rent || "");
            setDeposit(data.deposit || "");
            setMaintenanceCharge(data.maintenanceCharge || "");
            setMaintenancePeriod(data.maintenancePeriod || "Monthly");
            setAllInclusivePrice(data.allInclusivePrice || false);
            setTaxChargesExcluded(data.taxChargesExcluded || false);
            setPriceNegotiable(data.priceNegotiable || false);
            setPriceUnit(data.priceUnit || "Month");
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
    if (!auth?.currentUser) {
      setShowLoginPopup(true);
      return;
    }
    
    if (propertyType === "Plot" || listingType === "Sell") {
      if (!rent) {
        setError("Please fill all mandatory fields (marked with *).");
        return;
      }
    } else {
      if (!bedrooms || !bathrooms || !rent || !deposit || !maintenanceCharge) {
        setError("Please fill all mandatory fields (marked with *).");
        return;
      }
    }
    setError("");
    try {
      const base = {
        bedrooms: bedrooms === "5+" ? customBedrooms : bedrooms,
        bathrooms: bathrooms === "3+" ? customBathrooms : bathrooms,
        balconies: balconies === "3+" ? customBalconies : balconies,
        floorNo: floorNo === "5+" ? customFloorNo : floorNo,
        totalFloors: totalFloors === "5+" ? customTotalFloors : totalFloors,
        furnishedStatus,
        plotArea,
        plotUnit,
        plotLength,
        plotBreadth,
        carpetArea,
        carpetUnit,
        superArea,
        superUnit,
        rent,
        deposit,
        maintenanceCharge,
        maintenancePeriod,
        allInclusivePrice,
        taxChargesExcluded,
        priceNegotiable,
        priceUnit,
        photos: existingPhotos,
        videos: existingVideos,
        status: "published",
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
          
          {propertyType === "Plot" ? (
            <div className="space-y-8">
              {/* Plot Area Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#113b8f]">Add Area Details <span className="text-red-500">*</span></h2>
                  <button type="button" className="text-zinc-400 hover:text-zinc-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-[1fr,120px] overflow-hidden rounded-xl border border-zinc-200 bg-white focus-within:border-[#113b8f] focus-within:ring-1 focus-within:ring-[#113b8f]">
                  <input
                    placeholder="Plot Area"
                    className="px-4 py-3 text-sm outline-none placeholder:text-zinc-400"
                    value={plotArea}
                    onChange={(e) => setPlotArea(e.target.value)}
                  />
                  <select 
                    className="border-l border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none cursor-pointer"
                    value={plotUnit}
                    onChange={(e) => setPlotUnit(e.target.value)}
                  >
                    {AREA_UNITS.map((u) => (
                      <option key={u} value={u.toLowerCase().replace(/\s/g, '-')}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Dimensions Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#113b8f]">Property Dimensions</h2>
                <div className="space-y-3">
                  <input
                    placeholder="Length of plot (in Ft.)"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-[#113b8f] focus:ring-1 focus:ring-[#113b8f]"
                    value={plotLength}
                    onChange={(e) => setPlotLength(e.target.value)}
                  />
                  <input
                    placeholder="Breadth of plot (in Ft.)"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-[#113b8f] focus:ring-1 focus:ring-[#113b8f]"
                    value={plotBreadth}
                    onChange={(e) => setPlotBreadth(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-700">Bedrooms <span className="text-red-500">*</span></div>
                  <div className="flex flex-wrap gap-2">
                    {["1", "2", "3", "4", "5+"].map((o) => (
                      <Chip key={o} active={bedrooms === o} onClick={() => {
                        setBedrooms(o);
                        if (o !== "5+") setCustomBedrooms("");
                        if (o && bathrooms) setError("");
                      }}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                  {bedrooms === "5+" && (
                    <div className="mt-2">
                      <input
                        type="number"
                        placeholder="No. of Bedrooms"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        value={customBedrooms}
                        onChange={(e) => setCustomBedrooms(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-700">Bathrooms <span className="text-red-500">*</span></div>
                  <div className="flex flex-wrap gap-2">
                    {["1","2","3","3+"].map((o) => (
                      <Chip key={o} active={bathrooms === o} onClick={() => {
                        setBathrooms(o);
                        if (o !== "3+") setCustomBathrooms("");
                        if (o && bedrooms) setError("");
                      }}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                  {bathrooms === "3+" && (
                    <div className="mt-2">
                      <input
                        type="number"
                        placeholder="No. of Bathrooms"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        value={customBathrooms}
                        onChange={(e) => setCustomBathrooms(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              {groups.filter(g => g.label !== 'Floor No.' && g.label !== 'Total Floors').map((g) => (
                <div key={g.label}>
                  <div className="mb-2 text-sm font-medium text-zinc-700">{g.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.options.map((o) => {
                      const selected =
                        g.label === "Balconies"
                          ? balconies === o
                          : g.label === "Furnished Status"
                          ? furnishedStatus === o
                          : false;
                      const click = () => {
                        if (g.label === "Balconies") {
                          setBalconies(o);
                          if (o !== "3+") setCustomBalconies("");
                        } else if (g.label === "Furnished Status") {
                          setFurnishedStatus(o);
                        }
                      };
                      return (
                        <Chip key={o} active={selected} onClick={click}>
                          {o}
                        </Chip>
                      );
                    })}
                  </div>
                  {g.label === "Balconies" && balconies === "3+" && (
                    <div className="mt-2">
                      <input
                        type="number"
                        placeholder="No. of Balconies"
                        className="w-full max-w-xs rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        value={customBalconies}
                        onChange={(e) => setCustomBalconies(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-700">Floor No.</div>
                  <div className="flex flex-wrap gap-2">
                    {(groups.find(g => g.label === 'Floor No.')?.options || []).map((o) => (
                      <Chip key={o} active={floorNo === o} onClick={() => {
                        setFloorNo(o);
                        if (o !== "5+") setCustomFloorNo("");
                      }}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                  {floorNo === "5+" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Floor No. (e.g. 6)"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        value={customFloorNo}
                        onChange={(e) => setCustomFloorNo(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-700">Total Floors</div>
                  <div className="flex flex-wrap gap-2">
                    {(groups.find(g => g.label === 'Total Floors')?.options || []).map((o) => (
                      <Chip key={o} active={totalFloors === o} onClick={() => {
                        setTotalFloors(o);
                        if (o !== "5+") setCustomTotalFloors("");
                      }}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                  {totalFloors === "5+" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Total Floors (e.g. 10)"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        value={customTotalFloors}
                        onChange={(e) => setCustomTotalFloors(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {propertyType !== "Plot" && (
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
                    {AREA_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
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
                    {AREA_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-900">
            {listingType === "Sell" ? "Sell/ Lease Details" : "Rent/ Lease Details"}
          </h2>
          <div className="mt-6 space-y-6">
            {propertyType === "Plot" || listingType === "Sell" ? (
              <>
                {/* Expected Price Section */}
                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-700">
                    Expected Price <span className="text-red-500">*</span>
                  </div>
                  <div className="relative max-w-md">
                    <span className="pointer-events-none absolute left-3 top-3 text-zinc-500 text-lg">₹</span>
                    <input
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-zinc-200 pl-8 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-[#113b8f] focus:ring-1 focus:ring-[#113b8f]"
                      value={rent}
                      onChange={(e) => {
                        setRent(e.target.value);
                        if (e.target.value) setError("");
                      }}
                    />
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-6">
                    <label className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded border-zinc-300 text-[#113b8f] focus:ring-[#113b8f]" 
                        checked={allInclusivePrice}
                        onChange={(e) => setAllInclusivePrice(e.target.checked)}
                      />
                      All inclusive price
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded border-zinc-300 text-[#113b8f] focus:ring-[#113b8f]" 
                        checked={taxChargesExcluded}
                        onChange={(e) => setTaxChargesExcluded(e.target.checked)}
                      />
                      Tax and Govt. charges excluded
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded border-zinc-300 text-[#113b8f] focus:ring-[#113b8f]" 
                        checked={priceNegotiable}
                        onChange={(e) => setPriceNegotiable(e.target.checked)}
                      />
                      Price Negotiable
                    </label>
                  </div>
                </div>

                {/* Price Unit Section */}
                <div className="max-w-md">
                  <div className="mb-2 text-sm font-medium text-zinc-700">
                    Price Unit (if applicable)
                  </div>
                  <select
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#113b8f] focus:ring-1 focus:ring-[#113b8f] cursor-pointer"
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                  >
                    <option value="Month">Month</option>
                    <option value="Year">Year</option>
                    <option value="One-time">One-time</option>
                    {AREA_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 text-sm font-medium text-zinc-700">
                      Monthly Rent <span className="text-red-500">*</span>
                    </div>
                    <div className="relative border-b border-zinc-300 focus-within:border-blue-600">
                      <span className="pointer-events-none absolute left-0 top-2 text-sm text-zinc-500">₹</span>
                      <input
                        placeholder="Enter Total Rent"
                        className="w-full bg-transparent pl-4 py-2 text-sm outline-none placeholder:text-zinc-400"
                        value={rent}
                        onChange={(e) => {
                          setRent(e.target.value);
                          if (e.target.value && deposit && maintenanceCharge) setError("");
                        }}
                      />
                    </div>
                    <label className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-zinc-300" 
                        checked={priceNegotiable}
                        onChange={(e) => setPriceNegotiable(e.target.checked)}
                      />
                      Rent Negotiable
                    </label>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-medium text-zinc-700">
                      Security Amount <span className="text-red-500">*</span>
                    </div>
                    <div className="relative border-b border-zinc-300 focus-within:border-blue-600">
                      <span className="pointer-events-none absolute left-0 top-2 text-sm text-zinc-500">₹</span>
                      <input
                        placeholder="Security Amount"
                        className="w-full bg-transparent pl-4 py-2 text-sm outline-none placeholder:text-zinc-400"
                        value={deposit}
                        onChange={(e) => {
                          setDeposit(e.target.value);
                          if (e.target.value && rent && maintenanceCharge) setError("");
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-zinc-700">
                    Maintenance Charges <span className="text-red-500">*</span>
                  </div>
                  <div className="max-w-md relative border-b border-zinc-300 focus-within:border-blue-600">
                    <span className="pointer-events-none absolute left-0 top-2 text-sm text-zinc-500">₹</span>
                    <input
                      placeholder="Maintenance Charges"
                      className="w-full bg-transparent pl-4 py-2 text-sm outline-none placeholder:text-zinc-400"
                      value={maintenanceCharge}
                      onChange={(e) => {
                        setMaintenanceCharge(e.target.value);
                        if (e.target.value && rent && deposit) setError("");
                      }}
                    />
                  </div>
                </div>

                <div className="max-w-md">
                  <div className="mb-2 text-sm font-medium text-zinc-700">per <span className="text-red-500">*</span></div>
                  <select
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
                    value={maintenancePeriod}
                    onChange={(e) => setMaintenancePeriod(e.target.value)}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </>
            )}
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
              {(existingPhotos.length > 0 || existingVideos.length > 0) && (
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {existingPhotos.map((url, idx) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-zinc-200 group">
                      <img src={url} alt={`Photo ${idx}`} className="h-full w-full object-cover" />
                      
                      <button
                        type="button"
                        onClick={async () => {
                          const id = searchParams.get("id") || localStorage.getItem("roomDocId");
                          if (id && db) {
                            const newPhotos = [url, ...existingPhotos.filter((p) => p !== url)];
                            await updateDoc(doc(db, "rooms", id), { photos: newPhotos });
                            setExistingPhotos(newPhotos);
                          }
                        }}
                        className={`absolute left-1 top-1 z-20 rounded-full p-1.5 text-white shadow-lg transition-all ${idx === 0 ? "bg-emerald-500" : "bg-black/40 hover:bg-[#113b8f]"}`}
                        title={idx === 0 ? "Cover Image" : "Set as Cover"}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const id = searchParams.get("id") || localStorage.getItem("roomDocId");
                          if (id && db) {
                            const newPhotos = existingPhotos.filter((p) => p !== url);
                            await updateDoc(doc(db, "rooms", id), { photos: newPhotos });
                            setExistingPhotos(newPhotos);
                          }
                        }}
                        className="absolute right-1 top-1 z-20 rounded-full bg-black/40 p-1.5 text-white shadow-lg transition-all hover:bg-red-600"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>

                      {idx === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/90 py-0.5 text-center text-[10px] font-bold uppercase text-white">
                          Cover Image
                        </div>
                      )}
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
                          if (id && db) {
                            const newVideos = existingVideos.filter((v) => v !== url);
                            await updateDoc(doc(db, "rooms", id), { videos: newVideos });
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
                        const id = roomId || localStorage.getItem("roomDocId");
                        
                        if (!id) throw new Error("Room not initialized");
                        if (!files || !files.length) throw new Error("Select files first");
                        const folder = `rooms/${id}`;
                        const uploadedUrls: string[] = [];
                        
                        const uploadPromises = Array.from(files).map(async (f) => {
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

                        if (uploadedUrls.length > 0 && db) {
                          const field = uploadType === "photo" ? "photos" : "videos";
                          const currentUrls = uploadType === "photo" ? existingPhotos : existingVideos;
                          const updatedList = [...currentUrls, ...uploadedUrls];
                          
                          await updateDoc(doc(db, "rooms", id), { [field]: updatedList });
                          
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
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => router.push(`/add-room/location?id=${roomId || localStorage.getItem("roomDocId")}`)}
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-8 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Go Back
          </button>
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

export default function FeaturesPage() {
  return (
    <Suspense fallback={null}>
      <FeaturesPageInner />
    </Suspense>
  );
}