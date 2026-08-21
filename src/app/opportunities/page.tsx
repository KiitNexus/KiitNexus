'use client'

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FiCode, FiDatabase, FiPenTool, FiZap, FiBox, 
  FiCalendar, FiBook, FiMessageSquare, FiUser, 
  FiClock, FiChevronRight, FiBriefcase, FiUsers, FiFileText
} from 'react-icons/fi';

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'About', id: 'about', isRoute: false },
    { label: 'Projects', id: 'projects', isRoute: true },
    { label: 'Members', id: 'members', isRoute: true },
    { label: 'Events', id: 'opportunities', isRoute: true },
  ]
  const activeLink = 'opportunities'

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 lg:px-10 transition-all duration-700 ${scrolled
            ? 'py-4 bg-black/85 backdrop-blur-2xl border-b border-[#FFC20E]/10'
            : 'py-7 bg-transparent'
          }`}
      >
        <div className="flex items-center gap-3 group">
          {/* Official KIIT Logo */}
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

          {/* KIIT Nexus Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <img
              src="https://res.cloudinary.com/da9zvp0mu/image/upload/v1771705575/WhatsApp_Image_2026-02-22_at_1.46.53_AM-removebg-preview_rcftja.png"
              alt="KIIT Nexus"
              className="h-8 lg:h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,194,14,0.6)]"
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-[#FFC20E] font-black text-sm lg:text-base tracking-[0.2em]"
                style={{ fontFamily: 'monospace' }}
              >
                KIIT
              </span>
              <span
                className="text-white font-black text-sm lg:text-base tracking-[0.2em]"
                style={{ fontFamily: 'monospace' }}
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
                className={`relative px-3 lg:px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-full border ${activeLink === link.id
                    ? 'text-[#FFC20E] bg-white/5 border-[#FFC20E]/30 shadow-[0_0_15px_rgba(255,194,14,0.15)]'
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
                  }`}
                style={{ fontFamily: 'monospace' }}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.id}
                href={`/#${link.id}`}
                className={`relative px-3 lg:px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-full border text-gray-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10`}
                style={{ fontFamily: 'monospace' }}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <Link
          href="/#contact"
          className="relative overflow-hidden group border border-[#FFC20E]/70 text-[#FFC20E] text-xs font-bold tracking-[0.2em] uppercase px-5 lg:px-7 py-2.5 rounded-sm transition-all duration-300 hover:text-black"
          style={{ fontFamily: 'monospace' }}
        >
          <span className="relative z-10">Contact ↗</span>
        </Link>
      </motion.nav>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-xl">
        <div className="flex items-center gap-2">
          {/* Official KIIT Logo Mobile */}
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

          {/* KIIT Nexus Logo Mobile */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <img
              src="https://res.cloudinary.com/da9zvp0mu/image/upload/v1771705575/WhatsApp_Image_2026-02-22_at_1.46.53_AM-removebg-preview_rcftja.png"
              alt="KIIT Nexus"
              className="h-7 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-[#FFC20E] font-black text-[10px] tracking-[0.15em]"
                style={{ fontFamily: 'monospace' }}
              >
                KIIT
              </span>
              <span
                className="text-white font-black text-[10px] tracking-[0.15em]"
                style={{ fontFamily: 'monospace' }}
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
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-14 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-[#FFC20E]/20 overflow-hidden flex flex-col items-center py-8 gap-6 shadow-2xl"
          >
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.id}
                  href={`/${l.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`text-xs tracking-widest uppercase transition-colors ${activeLink === l.id ? 'text-[#FFC20E]' : 'text-gray-400 hover:text-[#FFC20E]'}`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.id}
                  href={`/#${l.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-400 hover:text-[#FFC20E] text-xs tracking-widest uppercase transition-colors"
                  style={{ fontFamily: 'monospace' }}
                >
                  {l.label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// --- PARTICLE BACKGROUND COMPONENT ---
// Exactly matches your landing page
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      constructor() {
        this.x = Math.random() * (canvas?.width ?? 0);
        this.y = Math.random() * (canvas?.height ?? 0);
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (canvas) {
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();
      }
    }

    const particleCount = window.innerWidth < 768 ? 80 : 280;
    particles.current = Array.from({ length: particleCount }, () => new Particle());

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.update();
        p.draw();
      });
      particles.current.forEach((p1, i) => {
        particles.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        const dx = p1.x - mouse.current.x, dy = p1.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.strokeStyle = `rgba(255,194,14,${0.45 * (1 - dist / 180)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 bg-black" />;
}

// --- MAIN PAGE COMPONENT ---
export default function OpportunitiesPage() {
  const [activeFilter, setActiveFilter] = useState('Recruitments (Coming Soon)');
  const filters = ['Recruitments (Coming Soon)'];

  const eventItems = [
    {
      type: 'Recruitments (Coming Soon)',
      title: 'KIIT Nexus Core Team Recruitment 2026',
      description: 'Join the core ecosystem developers, designers, and community managers driving innovation across the campus.',
      date: 'TBA (To Be Announced)',
      status: 'coming_soon',
      tags: ['Web Dev', 'App Dev', 'Machine Learning', 'Operations', 'Marketing', 'Graphic Design', 'Video Editing'],
      icon: <FiUsers size={20} />,
    }
  ];

  const filteredItems = eventItems.filter(item => {
    return item.type === activeFilter;
  });

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden selection:bg-[#FFC20E]/30 bg-black">
      <ParticlesBackground />
      <Navbar />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-28 md:py-36 flex flex-col items-center">
        
        {/* Header Section (Matching the massive Hero typography) */}
        <div className="flex flex-col items-center text-center w-full mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-8 md:w-12 bg-[#FFC20E]" />
            <span className="text-[#FFC20E] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase" style={{ fontFamily: 'monospace' }}>
              Events & Recruitments
            </span>
            <div className="h-px w-8 md:w-12 bg-[#FFC20E]" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col font-black uppercase leading-[0.9] tracking-tight mb-8" 
            style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
          >
            <span className="block text-white">WHERE</span>
            <span className="block text-[#FFC20E]">AMBITION</span>
            <span className="block text-white">MEETS</span>
            <span className="block text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}>
              OPPORTUNITY
            </span>
          </motion.h1>
          
          <p className="text-gray-400 text-xs md:text-sm max-w-lg mb-12 leading-relaxed" style={{ fontFamily: 'monospace' }}>
            Stay updated with upcoming hackathons, tech talks, workshops, and recruitment drives inside KIIT Nexus.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 bg-white/[0.02] backdrop-blur-md p-1.5 rounded-full border border-white/5">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-[#FFC20E]/10 border border-[#FFC20E]/50 text-[#FFC20E] shadow-[0_0_15px_rgba(255,194,14,0.15)]' 
                    : 'border border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                }`}
                style={{ fontFamily: 'monospace' }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-[#FFC20E]/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {item.status === 'coming_soon' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFC20E]/5 rounded-full blur-2xl pointer-events-none" />
              )}
              
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 text-white group-hover:text-[#FFC20E] group-hover:bg-[#FFC20E]/10 transition-colors rounded-xl">
                    {item.icon}
                  </div>
                  <span 
                    className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                      item.status === 'coming_soon' 
                        ? 'bg-neutral-800 text-gray-400 border border-white/5' 
                        : item.status === 'register_now'
                        ? 'bg-[#FFC20E] text-black'
                        : 'bg-white/5 text-gray-500'
                    }`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {item.status === 'coming_soon' 
                      ? 'Coming Soon' 
                      : item.status === 'register_now'
                      ? 'Register Now'
                      : 'Completed'
                    }
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.title}
                </h3>
                
                <p className="text-xs md:text-sm text-gray-400 mb-6 leading-relaxed" style={{ fontFamily: 'monospace' }}>
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-[9px] bg-white/[0.04] border border-white/5 text-gray-400 rounded-sm"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
                  <FiCalendar className="text-[#FFC20E]" />
                  <span>{item.date}</span>
                </div>

                <button 
                  disabled
                  className="px-4 py-2 bg-white/5 border border-white/10 text-gray-500 text-[10px] font-bold tracking-widest uppercase rounded-sm cursor-not-allowed opacity-50"
                  style={{ fontFamily: 'monospace' }}
                >
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}