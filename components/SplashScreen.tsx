'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import CustomPropertyIcon from './CustomPropertyIcon';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [animationStarted, setAnimationStarted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If we've already seen it this session, hide it
    const hasSeenSplash = sessionStorage.getItem('seenSplash');
    if (hasSeenSplash && !searchParams.get('forceSplash')) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleDismiss = (tab?: string) => {
    setAnimationStarted(false);
    sessionStorage.setItem('seenSplash', 'true');
    
    setTimeout(() => {
      setIsVisible(false);
      if (tab) {
        router.push(`/?tab=${tab}#properties`);
      }
    }, 500);
  };

  if (!isVisible) return null;

  const options = [
    { label: 'ROOM', key: 'Room' },
    { label: 'FLAT', key: 'Flat' },
    { label: 'PG', key: 'PG' },
    { label: 'PLOT', key: 'Plot' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-[#FFF5E1] transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${
        animationStarted ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 px-10">
        <div className="md:w-1/2 text-center md:text-left space-y-4">
          <h1 className="text-5xl md:text-8xl font-black text-black leading-[0.9] tracking-tighter uppercase">
            CHOOSE<br />OPTION
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-md">
            Select your preferred property type or skip to browse all properties.
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-5 max-w-xl">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleDismiss(opt.key)}
              className="flex items-center gap-4 px-8 py-5 bg-black text-white rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all group shadow-xl"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-white/20 blur-[2px] rounded-full group-hover:bg-white/40 transition-colors"></div>
                <CustomPropertyIcon className="w-6 h-6 text-white relative z-10" />
              </div>
              <span className="text-2xl font-black tracking-tight">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
        <button
          onClick={() => handleDismiss()}
          className="flex items-center gap-3 bg-white px-10 py-5 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ArrowUpRight className="w-6 h-6 text-black" />
          <span className="font-black text-black text-xl">Visit site</span>
        </button>

        <button
          onClick={() => {
            sessionStorage.removeItem('seenSplash');
            window.location.reload();
          }}
          className="p-6 bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:bg-gray-50 active:rotate-180 transition-all duration-500"
        >
          <RotateCcw className="w-8 h-8 text-black" />
        </button>
      </div>
    </div>
  );
}
