"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", id: "about", isRoute: false },
    { label: "Projects", id: "projects", isRoute: true },
    { label: "Members", id: "members", isRoute: true },
    { label: "Events", id: "opportunities", isRoute: true },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 lg:px-10 transition-all duration-700 ${scrolled ? "py-4 bg-black/85 backdrop-blur-2xl border-b border-[#FFC20E]/10" : "py-7 bg-transparent"}`}
      >
        <div className="flex items-center gap-3 group">
          <a
            href="https://kiit.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src="/KIIT_LOGO.webp"
              alt="KIIT University"
              className="h-8 lg:h-10 w-auto object-contain"
            />
          </a>
          <div className="h-6 w-px bg-white/20" />
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/da9zvp0mu/image/upload/v1771705575/WhatsApp_Image_2026-02-22_at_1.46.53_AM-removebg-preview_rcftja.png"
              alt="KIIT Nexus"
              className="h-8 lg:h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,194,14,0.6)]"
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-[#FFC20E] font-black text-sm lg:text-base tracking-[0.2em]"
                style={{ fontFamily: "monospace" }}
              >
                KIIT
              </span>
              <span
                className="text-white font-black text-sm lg:text-base tracking-[0.2em]"
                style={{ fontFamily: "monospace" }}
              >
                NEXUS
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-full px-2 py-1.5 backdrop-blur-xl shadow-2xl">
          {links.map((link) =>
            link.isRoute ? (
              <Link
                key={link.id}
                href={`/${link.id}`}
                className="relative px-3 lg:px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-full border text-gray-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
                style={{ fontFamily: "monospace" }}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.id}
                href={`/#${link.id}`}
                className="relative px-3 lg:px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-full border text-gray-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
                style={{ fontFamily: "monospace" }}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <Link
          href="/#contact"
          className="relative overflow-hidden group border border-[#FFC20E]/70 text-[#FFC20E] text-xs font-bold tracking-[0.2em] uppercase px-5 lg:px-7 py-2.5 rounded-sm transition-all duration-300 hover:text-black"
          style={{ fontFamily: "monospace" }}
        >
          <motion.div
            className="absolute inset-0 bg-[#FFC20E]"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          />
          <span className="relative z-10">Contact ↗</span>
        </Link>
      </motion.nav>

      {/* MOBILE NAVBAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-xl">
        <div className="flex items-center gap-2">
          <a
            href="https://kiit.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src="/KIIT_LOGO.webp"
              alt="KIIT University"
              className="h-7 w-auto object-contain"
            />
          </a>
          <div className="h-5 w-px bg-white/20" />
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/da9zvp0mu/image/upload/v1771705575/WhatsApp_Image_2026-02-22_at_1.46.53_AM-removebg-preview_rcftja.png"
              alt="KIIT Nexus"
              className="h-7 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-[#FFC20E] font-black text-[10px] tracking-[0.15em]"
                style={{ fontFamily: "monospace" }}
              >
                KIIT
              </span>
              <span
                className="text-white font-black text-[10px] tracking-[0.15em]"
                style={{ fontFamily: "monospace" }}
              >
                NEXUS
              </span>
            </div>
          </Link>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 flex flex-col gap-1.5"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-white"
          />
          <motion.span
            animate={
              menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
            }
            className="block w-5 h-px bg-white"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-5 h-px bg-white"
          />
        </button>
      </div>
      
      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-14 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-[#FFC20E]/20 overflow-hidden flex flex-col items-center py-8 gap-6 shadow-2xl"
          >
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.id}
                  href={`/${l.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-400 hover:text-[#FFC20E] text-xs tracking-widest uppercase transition-colors"
                  style={{ fontFamily: "monospace" }}
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-400 hover:text-[#FFC20E] text-xs tracking-widest uppercase transition-colors"
                  style={{ fontFamily: "monospace" }}
                >
                  {l.label}
                </Link>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function RecruitmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    semester: "",
    year: "",
    branch: "",
    domain: "",
    resume: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const domains = [
    "Web Dev",
    "App Dev",
    "Machine Learning",
    "Operations",
    "Marketing",
    "Graphic Design",
    "Video Editing",
    "Content Writing",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = formData.email.toLowerCase().trim();
    if (!finalEmail.endsWith("@kiit.ac.in")) {
      setStatus("Error: Only @kiit.ac.in email is allowed.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const finalData = { ...formData, email: finalEmail };
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        (process.env.NODE_ENV === "production"
          ? "https://nexus-workspace-backend.vercel.app"
          : "http://localhost:4000");
      const res = await fetch(`${backendUrl}/api/recruitments/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Application Submitted successfully!");
        setFormData({ name: "", email: "", whatsapp: "", semester: "", year: "", branch: "", domain: "", resume: "" });
      } else {
        setStatus(`Error: ${data.error || "Failed to submit application"}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error: Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-12 px-4 md:px-8 font-sans text-white selection:bg-pink-600 selection:text-white">
      <Navbar />
      {/* ---------- VICE CITY BACKGROUND (real image) ---------- */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/viceCity.jpeg')" }}
        />
        {/* dark overlay so the form stays readable over a busy photo */}
        <div className="absolute inset-0 bg-black/20" />
        {/* extra darkening toward the center where the card sits */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10,4,16,0.3) 0%, rgba(10,4,16,0.05) 55%, rgba(10,4,16,0.2) 100%)",
          }}
        />
      </div>
      {/* ---------- END BACKGROUND ---------- */}

      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-black/20 backdrop-blur-md border-[3px] border-[#ff0055] p-8 md:p-10 shadow-[8px_8px_0px_#ff0055]"
        >
          <div className="text-center mb-8">
            <h1
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic drop-shadow-[2px_2px_0px_#000]"
              style={{
                background: "linear-gradient(90deg, #ff2f92 0%, #ff7a3d 50%, #ffd76a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transform: "skewX(-4deg)",
              }}
            >
              Join KIIT Nexus
            </h1>
            <p className="text-lg text-cyan-200/90 mt-2 font-bold uppercase tracking-widest">
              Recruitment Drive '26
            </p>
          </div>

          {status && (
            <div
              className={`p-4 mb-6 text-center font-bold uppercase tracking-wide border-2 ${
                status.startsWith("Error")
                  ? "border-red-500 bg-red-900/50 text-red-300"
                  : "border-green-500 bg-green-900/50 text-green-300"
              }`}
            >
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-pink-500">
                  Full Name <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/30 border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-yellow-400 transition-colors uppercase font-bold"
                  placeholder="YOUR NAME"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-pink-500">
                  KIIT Email <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/30 border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-yellow-400 transition-colors font-bold lowercase"
                  placeholder="roll@kiit.ac.in"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-pink-500">
                  WhatsApp Number <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full bg-black/30 border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-yellow-400 transition-colors font-bold uppercase"
                  placeholder="XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-pink-500">
                  Branch <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  name="branch"
                  required
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-black/30 border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-yellow-400 transition-colors uppercase font-bold"
                  placeholder="CSE / IT"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-pink-500">
                  Semester <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  name="semester"
                  required
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full bg-black/30 border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-yellow-400 transition-colors uppercase font-bold"
                  placeholder="3RD"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-pink-500">
                  Year <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-black/30 border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-yellow-400 transition-colors uppercase font-bold"
                  placeholder="2ND YEAR"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-pink-500">
                  Domain of Interest <span className="text-yellow-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="domain"
                    required
                    value={formData.domain}
                    onChange={handleChange}
                    className="w-full appearance-none bg-black/30 border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-yellow-400 transition-colors uppercase font-bold cursor-pointer"
                  >
                    <option value="" disabled>Select Domain</option>
                    {domains.map((d) => (
                      <option key={d} value={d} className="uppercase bg-[#1a1a1a]">
                        {d}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-yellow-400">
                    ▼
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-pink-500">
                  Resume (Public Link)
                </label>
                <input
                  type="url"
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  className="w-full bg-black/30 border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-yellow-400 transition-colors font-bold"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-yellow-400 hover:bg-yellow-300 text-black border-[3px] border-black p-4 text-xl font-black uppercase tracking-widest transition-transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Processing..." : "Apply Now"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}