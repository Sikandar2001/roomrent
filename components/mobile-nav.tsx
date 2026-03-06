 "use client";
 import Link from "next/link";
 import { usePathname } from "next/navigation";
 import { Home, Search, Heart, BadgeIndianRupee, Crown } from "lucide-react";
 
 const items = [
   { label: "Home", href: "/", icon: Home },
   { label: "Search", href: "/#properties", icon: Search },
   { label: "ShortList", href: "/dashboard/favourite", icon: Heart },
   { label: "PropWorth", href: "/contact-us", icon: BadgeIndianRupee },
   { label: "MB Prime", href: "/signup", icon: Crown },
 ];
 
 export default function MobileNav() {
   const pathname = usePathname() || "/";
 
   return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
      <ul className="mx-auto grid max-w-7xl grid-cols-5">
         {items.map(({ label, href, icon: Icon }) => {
           const active =
             href === "/"
               ? pathname === "/"
               : pathname.startsWith(href.replace("/#", "/"));
           return (
             <li key={label}>
               <Link
                 href={href}
                className={`flex flex-col items-center justify-center gap-1 py-2 text-[11px] ${
                  active ? "text-[#113b8f] bg-zinc-50" : "text-zinc-600"
                 }`}
               >
                 <Icon className="h-5 w-5" />
                 <span className="leading-none">{label}</span>
               </Link>
             </li>
           );
         })}
       </ul>
     </nav>
   );
 }
