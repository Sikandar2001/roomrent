"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Globe, Facebook, Twitter, Instagram, Youtube, Send, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setLoading(true);
    setError("");
    
    try {
      await addDoc(collection(db, "inquiry"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      console.error("Submission error:", err);
      const firebaseError = err as { message?: string };
      setError(firebaseError.message || "Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF5E1]">
      {/* Hero Section */}
      <div 
        className="relative h-[300px] w-full bg-cover bg-center flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(17, 59, 143, 0.7), rgba(17, 59, 143, 0.7)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop')"
        }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-[#eab308]">Contact Us</h1>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-[#eab308]">Contact Us</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full rounded-full border border-zinc-300 bg-zinc-50 px-6 py-3 text-sm outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700">Your Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 w-full rounded-full border border-zinc-300 bg-zinc-50 px-6 py-3 text-sm outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 w-full rounded-full border border-zinc-300 bg-zinc-50 px-6 py-3 text-sm outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-2 w-full rounded-full border border-zinc-300 bg-zinc-50 px-6 py-3 text-sm outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700">Your Message</label>
                <textarea 
                  rows={6}
                  required
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-2 w-full rounded-3xl border border-zinc-300 bg-zinc-50 px-6 py-4 text-sm outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308] resize-none"
                />
              </div>
            </div>

            {success && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-100">
                <CheckCircle2 size={18} />
                Your inquiry has been sent successfully!
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700 border border-rose-100">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-[#eab308] px-8 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Sending..." : (
                <>
                  <Send size={14} />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Contact Info Sidebar */}
          <div className="space-y-10 lg:pl-8">
            <div className="space-y-4">
              <span className="text-sm font-medium italic text-[#eab308]">Contact Us</span>
              <h2 className="text-4xl font-bold text-zinc-900 leading-tight">Get In Touch</h2>
              <p className="text-sm leading-relaxed text-zinc-500">
                Nullam fermentum ullamcorper diam sit amet porta. Etiam ac enim velit. Ut ut mi sed turpis accumsan sagittis ac eu magna. Etiam ac nisi tellus. Morbi at velit nisi. Donec ut felis libero. Donec tincidunt consequat tellus, id mattis sapien condimentum.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <a href="tel:8542898438" className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-[#eab308] shadow-sm transition-colors group-hover:bg-[#eab308] group-hover:text-white">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Call Us</h3>
                  <p className="text-sm text-zinc-500 mt-1">8542898438</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-[#eab308] shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Email Us</h3>
                  <p className="text-sm text-zinc-500 mt-1">hello@awesomesite.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-[#eab308] shadow-sm">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Website</h3>
                  <p className="text-sm text-zinc-500 mt-1">www.awesomesite.com</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900">Follow Us On</h3>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <button key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eab308] text-white shadow-md transition-transform hover:scale-110">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
