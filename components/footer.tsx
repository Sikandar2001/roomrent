import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Youtube, Instagram, Rss } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 items-start gap-12 text-center md:grid-cols-3 md:text-left">
          
          {/* Top Left Faded Icons (Background Style) */}
          <div className="absolute left-0 top-0 hidden gap-4 opacity-10 md:flex">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900"><Facebook className="h-5 w-5" /></div>
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-900"><Twitter className="h-5 w-5" /></div>
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-900"><PinterestIcon className="h-5 w-5" /></div>
          </div>

          {/* Left Column */}
          <div className="flex flex-col space-y-5 pt-4 text-[10px] font-bold tracking-[0.2em] uppercase">
            <Link href="/contact-us" className="hover:text-zinc-400">GET SUPPORT</Link>
            <Link href="/contact-us" className="hover:text-zinc-400">FIND A DESIGNER</Link>
            <Link href="/dashboard/profile" className="hover:text-zinc-400">YOUR ACCOUNT</Link>
            <Link href="/privacy-policy" className="hover:text-zinc-400">PRIVACY & COOKIE POLICY</Link>
          </div>

          {/* Center Column */}
          <div className="flex flex-col items-center space-y-10">
            <div className="relative flex h-24 w-24 items-center justify-center border-[1px] border-white p-2">
              <Image
                src="/images/image.png"
                alt="MKSUKO Logo"
                fill
                sizes="96px"
                className="object-contain invert"
                priority
              />
            </div>
            <p className="max-w-xs text-center text-[11px] leading-relaxed tracking-wider text-zinc-400">
              Divi Child Themes, ProPhoto 7 Designs, Showit Designs and online courses for photographers and small, creative businesses.
            </p>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-5 pt-4 text-[10px] font-bold tracking-[0.2em] uppercase md:items-end">
            <Link href="/#properties" className="hover:text-zinc-400">ALL PRODUCTS</Link>
            <Link href="/#properties" className="hover:text-zinc-400">DIVI CHILD THEMES</Link>
            <Link href="/#properties" className="hover:text-zinc-400">PROPHOTO 7 DESIGNS</Link>
            <Link href="/#properties" className="hover:text-zinc-400">SHOWIT DESIGNS</Link>
            <Link href="/#properties" className="hover:text-zinc-400">STATIONERY</Link>
          </div>
        </div>

        {/* Social Icons Bottom */}
        <div className="mt-16 flex justify-center space-x-8 text-white opacity-80">
          <Link href="#" className="hover:opacity-100 transition-opacity">
            <Facebook className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:opacity-100 transition-opacity">
            <Twitter className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:opacity-100 transition-opacity">
            <PinterestIcon className="h-4 w-4" />
          </Link>
          <Link href="#" className="hover:opacity-100 transition-opacity">
            <Youtube className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:opacity-100 transition-opacity">
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:opacity-100 transition-opacity">
            <Rss className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="none" 
      className={className}
    >
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592 0 12.017 0z" />
    </svg>
  );
}
