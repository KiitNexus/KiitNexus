"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Members from "@/components/Members";

function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      x = Math.random() * canvas!.width;
      y = Math.random() * canvas!.height;
      vx = (Math.random() - 0.5) * 0.4;
      vy = (Math.random() - 0.5) * 0.4;
      size = Math.random() * 1.5 + 0.5;
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(255,255,255,0.35)";
        ctx!.fill();
      }
    }

    const particles = Array.from(
      { length: window.innerWidth < 768 ? 60 : 200 },
      () => new Particle(),
    );
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        const dx = p1.x - mouse.current.x,
          dy = p1.y - mouse.current.y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.strokeStyle = `rgba(255,194,14,${0.4 * (1 - d / 160)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function Glow() {
  return (
    <>
      <div
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(255,194,14,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(circle, rgba(255,194,14,0.03) 0%, transparent 70%)",
        }}
      />
    </>
  );
}

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
    { label: "Opportunities", id: "opportunities", isRoute: false },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 lg:px-10 transition-all duration-700 ${scrolled ? "py-4 bg-black/85 backdrop-blur-2xl border-b border-[#FFC20E]/10" : "py-7 bg-transparent"}`}
      >
        <Link href="/" className="flex items-center gap-3 group">
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

        <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-full px-2 py-1.5 backdrop-blur-xl shadow-2xl">
          {links.map((link) =>
            link.isRoute ? (
              <Link
                key={link.id}
                href={`/${link.id}`}
                className={`relative px-3 lg:px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-full border ${link.id === "members" ? "text-[#FFC20E] bg-white/5 border-[#FFC20E]/30 shadow-[0_0_15px_rgba(255,194,14,0.15)]" : "text-gray-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"}`}
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

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-xl">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/da9zvp0mu/image/upload/v1771705575/WhatsApp_Image_2026-02-22_at_1.46.53_AM-removebg-preview_rcftja.png"
            alt="KIIT Nexus"
            className="h-7 w-auto object-contain"
          />
          <span
            className="text-[#FFC20E] font-black text-sm tracking-[0.2em]"
            style={{ fontFamily: "monospace" }}
          >
            NEXUS
          </span>
        </Link>
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
                  className={`text-xs tracking-widest uppercase transition-colors ${l.id === "members" ? "text-[#FFC20E]" : "text-gray-400 hover:text-[#FFC20E]"}`}
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

export default function AllMembersPage() {
  return (
    <div className="bg-black text-white selection:bg-[#FFC20E]/30 min-h-screen overflow-x-hidden w-full relative">
      <ParticlesBackground />
      <Glow />
      <Navbar />
      <div className="pt-20">
        <Members isHomepage={false} />
      </div>
    </div>
  );
}