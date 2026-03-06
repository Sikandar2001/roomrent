"use client";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  city: string;
};

const DATA: Testimonial[] = [
  {
    quote:
      "I listed my property and received multiple inquiries in a week. The interface is user-friendly and the visibility is amazing.",
    name: "Sneha Kapoor",
    city: "Mumbai",
  },
  {
    quote:
      "I'm always scouting for new property investments, and this site gives me great leads in top cities. Trustworthy and efficient.",
    name: "Aditya Sharma",
    city: "Bangalore",
  },
  {
    quote:
      "As a first-time buyer, I had many questions, but the support team guided me patiently. Listings are real, verified, and worth checking.",
    name: "Pooja Bansal",
    city: "Pune",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const sync = () => setPerView(window.innerWidth < 640 ? 1 : 3);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  const lastIndex = Math.max(0, DATA.length - perView);
  const prev = () => setIdx((v) => (v - 1 < 0 ? lastIndex : v - 1));
  const next = () => setIdx((v) => (v + 1 > lastIndex ? 0 : v + 1));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e6f0ff] to-[#ffffff] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            What our client says
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-[2px] w-12 bg-[#113b8f]" />
            <span className="grid h-6 w-6 place-items-center rounded-md border border-[#113b8f] text-[#113b8f]">★</span>
            <span className="h-[2px] w-12 bg-[#113b8f]" />
          </div>
        </div>
        <div className="relative mt-10 overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500"
            style={{ transform: `translateX(-${(idx * 100) / perView}%)` }}
          >
            {DATA.map((t, i) => (
              <div
                key={t.name + i}
                className="min-w-0"
                style={{ width: `${100 / perView}%` }}
              >
                <div className="h-full rounded-2xl bg-white p-6 shadow-lg ring-1 ring-zinc-200">
                  <p className="text-zinc-700">“{t.quote}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-zinc-400">
                      <span>👤</span>
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900">{t.name}</div>
                      <div className="text-xs text-zinc-500">{t.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-500">Slide left or right</div>
      </div>
    </section>
  );
}
