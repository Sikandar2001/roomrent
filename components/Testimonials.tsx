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
  const [perView, setPerView] = useState(1); // Default to 1 for mobile first

  useEffect(() => {
    const sync = () => {
      if (window.innerWidth >= 1024) setPerView(3);
      else if (window.innerWidth >= 640) setPerView(2);
      else setPerView(1);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const lastIndex = Math.max(0, DATA.length - perView);
  const prev = () => setIdx((v) => (v - 1 < 0 ? lastIndex : v - 1));
  const next = () => setIdx((v) => (v + 1 > lastIndex ? 0 : v + 1));

  return (
    <section className="relative overflow-hidden bg-[#FFF5E1] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            What our client says
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-[2px] w-12 bg-[#113b8f]" />
            <span className="grid h-6 w-6 place-items-center rounded-md border border-[#113b8f] text-[#113b8f]">
              ★
            </span>
            <span className="h-[2px] w-12 bg-[#113b8f]" />
          </div>
        </div>

        <div className="relative mt-10">
          <div className="overflow-hidden px-4">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${idx * (100 / perView)}%)`,
              }}
            >
              {DATA.map((t, i) => (
                <div
                  key={t.name + i}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / perView}%` }}
                >
                  <div className="h-full rounded-2xl bg-white p-8 shadow-lg ring-1 ring-zinc-200">
                    <p className="text-lg leading-relaxed text-zinc-700 italic">
                      “{t.quote}”
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#113b8f] to-[#0a265e] text-white shadow-md">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900">{t.name}</div>
                        <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                          {t.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute -left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl font-bold text-[#113b8f] shadow-md transition-all hover:bg-zinc-50 active:scale-95 sm:left-0"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute -right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl font-bold text-[#113b8f] shadow-md transition-all hover:bg-zinc-50 active:scale-95 sm:right-0"
            aria-label="Next"
          >
            ›
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {DATA.slice(0, lastIndex + 1).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-8 bg-[#113b8f]" : "w-2 bg-zinc-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="mt-4 text-center text-xs font-medium text-zinc-400 uppercase tracking-widest">
          Slide left or right
        </div>
      </div>
    </section>
  );
}
