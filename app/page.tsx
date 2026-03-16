'use client';
import { useState, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CustomPropertyIcon from "@/components/CustomPropertyIcon";
const PropertiesSection = lazy(() => import("@/components/Properties"));
const Testimonials = lazy(() => import("@/components/Testimonials"));

const numberFmt = new Intl.NumberFormat("en-US");

export default function Page() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append("q", keyword);
    if (location) params.append("location", location);
    if (type) params.append("tab", type);
    
    router.push(`/?${params.toString()}#properties`);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#FFF5E1]">
        <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div
            className="relative flex min-h-[70vh] items-end bg-cover bg-center lg:min-h-screen"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%), url('/images/room.jpg')",
            }}
          >
            <div className="absolute inset-0" />
            <div className="relative w-full p-8 sm:p-12 lg:p-16">
              <div className="max-w-xl space-y-5 text-white drop-shadow">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                  We Can Find just Right Property for You.
                </h1>
                <p className="text-base text-white/90">
                  We deal with different kinds of properties. Whether you need a
                  house, an apartment, or a garage, you&apos;ll find a good option
                  on our platform.
                </p>
                <Link 
                  href="#properties"
                  className="inline-flex items-center rounded-full bg-[#eab308] px-6 py-3 text-sm font-semibold text-[#0a265e] shadow-lg shadow-black/20 transition hover:bg-[#d8a50d]"
                >
                  VIEW PROPERTIES
                </Link>
              </div>
            </div>
          </div>
          <div className="flex min-h-[70vh] items-center bg-[#FFF5E1] p-6 sm:p-10 lg:min-h-screen lg:p-12">
            <div className="w-full">
              <h2 className="mb-6 text-center text-2xl font-extrabold uppercase tracking-wide text-[#113b8f]">
                Advanced Search
              </h2>
              <form onSubmit={handleSearch} className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-zinc-200">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label htmlFor="keyword" className="sr-only">
                      Keyword
                    </label>
                    <input
                      id="keyword"
                      placeholder="Keyword (E.G: 'Office')"
                      className="h-11 w-full rounded-lg border border-zinc-300 px-4 text-sm outline-none ring-blue-600/20 placeholder:text-zinc-400 focus:ring-2"
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="location" className="sr-only">
                      Location
                    </label>
                    <select
                      id="location"
                      className="h-11 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none ring-blue-600/20 focus:ring-2"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="" disabled>
                        Location
                      </option>
                      <option value="Noida">Noida</option>
                      <option value="Greater Noida">Greater Noida</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="type" className="sr-only">
                      Property Type
                    </label>
                    <select
                      id="type"
                      className="h-11 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none ring-blue-600/20 focus:ring-2"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="" disabled>
                        Property Type
                      </option>
                      <option value="Room">Room</option>
                      <option value="Flat">Flat</option>
                      <option value="PG">PG</option>
                      <option value="Plot">Plot</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="status" className="sr-only">
                      Property Status
                    </label>
                    <select
                      id="status"
                      className="h-11 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none ring-blue-600/20 focus:ring-2"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Property Status
                      </option>
                      <option>For Rent</option>
                      <option>For Sale</option>
                      <option>Sold</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="beds" className="sr-only">
                      Min Beds
                    </label>
                    <select
                      id="beds"
                      className="h-11 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none ring-blue-600/20 focus:ring-2"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Min Beds
                      </option>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="baths" className="sr-only">
                      Min Baths
                    </label>
                    <select
                      id="baths"
                      className="h-11 w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm outline-none ring-blue-600/20 focus:ring-2"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Min Baths
                      </option>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <option key={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="minArea" className="sr-only">
                      Min Area
                    </label>
                    <input
                      id="minArea"
                      placeholder="Min Area (Sq Ft)"
                      className="h-11 w-full rounded-lg border border-zinc-300 px-4 text-sm outline-none ring-blue-600/20 placeholder:text-zinc-400 focus:ring-2"
                      type="number"
                      min={0}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="maxArea" className="sr-only">
                      Max Area
                    </label>
                    <input
                      id="maxArea"
                      placeholder="Max Area (Sq Ft)"
                      className="h-11 w-full rounded-lg border border-zinc-300 px-4 text-sm outline-none ring-blue-600/20 placeholder:text-zinc-400 focus:ring-2"
                      type="number"
                      min={0}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-medium text-[#113b8f] hover:underline"
                  >
                    <span>Show more search options</span>
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#eab308] px-6 py-3 text-sm font-semibold text-[#0a265e] shadow hover:bg-[#d8a50d]"
                  >
                    SEARCH
                  </button>
                </div>
              </form>

              {/* Options Row for ROOM, FLAT, PG, PLOT - Right Side */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  { label: 'RENT', key: 'Room' },
                  { label: 'PLOT', key: 'Plot' },
                ].map((opt) => (
                  <Link
                    key={opt.label}
                    href={`/?tab=${opt.key}#properties`}
                    className="flex items-center gap-2 px-6 py-3 bg-[#113b8f] text-white rounded-full hover:scale-105 transition-all group border border-white/10 shadow-lg shadow-black/20"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-white/20 blur-[1px] rounded-full"></div>
                      <CustomPropertyIcon className="w-5 h-5 text-white relative z-10" />
                    </div>
                    <span className="text-base font-black tracking-tight uppercase">{opt.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="bg-[#FFF5E1] py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6 h-7 w-64 rounded bg-zinc-200" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                    <div className="h-52 w-full rounded-t-xl bg-zinc-100" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-48 rounded bg-zinc-100" />
                      <div className="h-3 w-28 rounded bg-zinc-100" />
                      <div className="h-3 w-60 rounded bg-zinc-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <PropertiesSection />
      </Suspense>
      <Suspense fallback={<div className="py-10" />}>
        <Testimonials />
      </Suspense>
      
    </>
  );
}
