'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { FiExternalLink, FiUsers, FiUser } from 'react-icons/fi'
import Members from './Members'
import Glow from './Glow'
import Contact from '@/components/Contact'
import Link from 'next/link'
const HERO_IMAGES = [
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407136/ABHISHEK_DHAL_FOUNDER_COORDINATOR_abjldw.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407136/ADITYA_VIKRAM_SINGH_CO-FOUNDER_it2ovu.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407141/NISTHA_MISHRA_TECHNICAL_HEAD_kfy6yp.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407146/SHIVAM_TECHNICAL_HEAD_tvgbiu.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407140/ISHIKA_JAISWAL_TECHNICAL_HEAD_yonvki.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407139/CHANDAN_KUMAR_LEAD_WEB_DEV_uzuvtu.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407138/ANANYA_RAJ_LEAD_APP_DEV_FLUTTER_dhsacs.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407138/ANURAG_MUKHERJEE_LEAD_APP_DEV_ANDROID_vex2is.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407147/SHRIDIPA_DHAR_LEAD_ML_t6kwms.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771408451/ARYAN_KUMAR_LEAD_OPERATIONS_obmshf.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407143/OWAIS_LEAD_GRAPHIC_DESIGNING_k9rl0p.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771407145/SAYAN_BARMAN_LEAD_BROADCASTING_auk8zp.png',
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771408453/IPSIT_DAS_LEAD_MARKETING_mpoklh.png',
]

const GROUP_PHOTO =
  'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771788848/74b1aa3b-dfcd-4bc6-91df-d17dd8af361f.png'


interface ParticleType {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  update: () => void
  draw: () => void
}
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<ParticleType[]>([])
  const mouse = useRef({ x: -9999, y: -9999 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      constructor() {
        this.x = Math.random() * (canvas?.width ?? 0)
        this.y = Math.random() * (canvas?.height ?? 0)
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.size = Math.random() * 1.5 + 0.5
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        if (canvas) {
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1
        }
      }
      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.fill()
      }
    }

    // Reduce particles on mobile for performance
    const particleCount = window.innerWidth < 768 ? 80 : 280
    particles.current = Array.from(
      { length: particleCount },
      () => new Particle(),
    )

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current.forEach((p) => {
        p.update()
        p.draw()
      })
      particles.current.forEach((p1, i) => {
        particles.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x,
            dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - dist / 130)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
        const dx = p1.x - mouse.current.x,
          dy = p1.y - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 180) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mouse.current.x, mouse.current.y)
          ctx.strokeStyle = `rgba(255,194,14,${0.45 * (1 - dist / 180)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}


function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      const navHeight = window.innerWidth < 768 ? 56 : 0
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }, 100)
  }

  const links = [
    { label: 'About', id: 'about', isRoute: false },
    { label: 'Projects', id: 'projects', isRoute: true },
    { label: 'Members', id: 'members', isRoute: true },
    { label: 'Events', id: 'opportunities', isRoute: true },
  ]

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
        {/* LOGO */}
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

        {/* LINKS */}
        <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-full px-2 py-1.5 backdrop-blur-sm shadow-2xl">
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
              <button
                key={link.id}
                onClick={() => {
                  scrollTo(link.id)
                  setActiveLink(link.id)
                }}
                className={`relative px-3 lg:px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-full border ${activeLink === link.id
                    ? 'text-[#FFC20E] bg-white/5 border-[#FFC20E]/30 shadow-[0_0_15px_rgba(255,194,14,0.15)]'
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
                  }`}
                style={{ fontFamily: 'monospace' }}
              >
                {link.label}
              </button>
            )
          )}
        </div>

        {/* Contact */}
        <motion.button
          onClick={() => scrollTo('contact')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden group border border-[#FFC20E]/70 text-[#FFC20E] text-xs font-bold tracking-[0.2em] uppercase px-5 lg:px-7 py-2.5 rounded-sm transition-all duration-300 hover:text-black"
          style={{ fontFamily: 'monospace' }}
        >
          <motion.div
            className="absolute inset-0 bg-[#FFC20E]"
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          />
          <span className="relative z-10">Contact ↗</span>
        </motion.button>
      </motion.nav>

      {/* MOBILE NAV */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-black/90 backdrop-blur-sm border-b border-white/5 shadow-xl">
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
            className="md:hidden fixed top-14 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b border-[#FFC20E]/20 overflow-hidden flex flex-col items-center py-8 gap-6 shadow-2xl"
          >
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.id}
                  href={`/${l.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-400 hover:text-[#FFC20E] text-xs tracking-widest uppercase transition-colors"
                  style={{ fontFamily: 'monospace' }}
                >
                  {l.label}
                </Link>
              ) : (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="text-gray-400 hover:text-[#FFC20E] text-xs tracking-widest uppercase transition-colors"
                  style={{ fontFamily: 'monospace' }}
                >
                  {l.label}
                </button>
              )
            )}
            <button
              onClick={() => scrollTo('contact')}
              className="border border-[#FFC20E] text-[#FFC20E] text-xs px-8 py-2.5 tracking-widest uppercase"
              style={{ fontFamily: 'monospace' }}
            >
              Contact ↗
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


function Ticker() {
  const items = [
    'KIIT NEXUS',
    'INNOVATE · BUILD · REPEAT',
    'CAMPUS-EXCLUSIVE',
    'WHERE AMBITION MEETS OPPORTUNITY',
    'JOIN THE ECOSYSTEM',
    'INNOVATE · CONNECT · GROW',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden py-3 md:py-4 border-y border-white/5 bg-black/40 backdrop-blur-sm">
      <motion.div
        className="flex gap-8 md:gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 md:gap-12 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white/30"
            style={{ fontFamily: 'monospace' }}
          >
            {item}
            <span className="text-[#FFC20E]/50 text-sm md:text-base">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}


interface SpotlightButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  overlayColor?: string
}
function SpotlightButton({
  children,
  onClick,
  className = '',
  overlayColor = 'rgba(255,255,255,0.2)',
}: SpotlightButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    btnRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`)
    btnRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }
  return (
    <motion.button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden group ${className}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(140px circle at var(--x) var(--y), ${overlayColor}, transparent 80%)`,
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}


function Hero({ imgIndex }: { imgIndex: number }) {
  const { scrollY } = useScroll()
  const yText = useTransform(scrollY, [0, 500], [0, -80])
  const yImg = useTransform(scrollY, [0, 500], [0, 60])
  const opacity = useTransform(scrollY, [0, 350], [1, 0])

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-black flex items-end pb-0"
    >
      {/* BG IMAGE */}
      <motion.div
        className="absolute right-0 top-0 h-full w-full md:w-[55%] z-0"
        style={{ y: yImg }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIndex}
            src={HERO_IMAGES[imgIndex]}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.75, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="w-full h-full object-cover object-top brightness-125 contrast-110"
          />
        </AnimatePresence>
        {/* left fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        {/* bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        {/* top fade for mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent md:hidden" />
      </motion.div>

      {/* GRAIN OVERLAY */}
      <div
        className="absolute right-0 top-0 h-full w-full md:w-[55%] z-[1] pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px',
        }}
      />

      {/* TEXT CONTENT */}
      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 w-full px-6 sm:px-8 md:px-16 lg:px-24 pb-16 md:pb-24 pt-28 md:pt-40"
      >
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="flex items-center gap-3 mb-6 md:mb-8"
        >
          <div className="h-px w-8 md:w-12 bg-[#FFC20E]" />
          <span
            className="text-[#FFC20E] text-[10px] md:text-xs font-bold tracking-[0.25em] md:tracking-[0.35em] uppercase"
            style={{ fontFamily: 'monospace' }}
          >
            KIIT University · Est. 2024
          </span>
        </motion.div>

        {/* MAIN HEADLINE */}
        <div className="overflow-hidden">
          {['WHERE', 'AMBITION', 'MEETS'].map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.div
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.6 + i * 0.12,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span
                  className={`block font-black leading-[0.88] tracking-tight ${i === 1 ? 'text-[#FFC20E]' : 'text-white'
                    }`}
                  style={{
                    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                    fontSize: 'clamp(1.6rem, 8.5vw, 8.5rem)',
                  }}
                >
                  {word}
                </span>
              </motion.div>
            </div>
          ))}
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.96,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span
                className="block font-black leading-[0.88] tracking-tight text-transparent whitespace-nowrap"
                style={{
                  fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.35)',
                  fontSize: 'clamp(1.6rem, 8.5vw, 8.5rem)',
                }}
              >
                OPPORTUNITY
              </span>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-8 md:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8"
        >
          {/* DESCRIPTION */}
          <p
            className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-[280px] md:max-w-xs"
            style={{ fontFamily: 'monospace' }}
          >
            A campus-exclusive digital ecosystem connecting builders, dreamers &
            innovators at KIIT.
          </p>

          {/* BUTTONS */}
          <div className="flex items-center gap-3 md:gap-4">
            <SpotlightButton
              className="px-5 md:px-7 py-3 md:py-3.5 bg-[#FFC20E] text-black font-bold text-xs md:text-sm tracking-widest uppercase rounded-sm shadow-[0_0_35px_rgba(255,194,14,0.5)]"
              overlayColor="rgba(255,255,255,0.4)"
              onClick={() =>
                document
                  .getElementById('about')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Enter Nexus
            </SpotlightButton>
            <SpotlightButton
              className="px-5 md:px-7 py-3 md:py-3.5 border border-white/20 text-white font-medium text-xs md:text-sm tracking-widest uppercase rounded-sm backdrop-blur-sm"
              overlayColor="rgba(255,194,14,0.15)"
              onClick={() =>
                document
                  .getElementById('projects')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore ↓
            </SpotlightButton>
          </div>

          {/* LIVE DOT */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC20E] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFC20E]" />
            </span>
            <span
              className="text-gray-500 text-[10px] tracking-widest uppercase"
              style={{ fontFamily: 'monospace' }}
            >
              System Online
            </span>
          </div>
        </motion.div>

        {/* SCROLL INDICATOR — desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden md:flex"
        >
          <span
            className="text-white/20 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'monospace' }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-[#FFC20E]/60 to-transparent"
          />
        </motion.div>
      </motion.div>

      {/* IMAGE INDEX DOTS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2"
      >
        {HERO_IMAGES.map((_, i) => (
          <div
            key={i}
            className={`w-px transition-all duration-500 ${i === imgIndex ? 'h-8 bg-[#FFC20E]' : 'h-3 bg-white/20'}`}
          />
        ))}
      </motion.div>
    </section>
  )
}


function About() {
  return (
    <section
      id="about"
      className="relative z-20 py-20 md:py-40 px-6 md:px-16 lg:px-24 bg-black"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#FFC20E]" />
              <span
                className="text-[#FFC20E] text-xs font-bold tracking-[0.3em] uppercase"
                style={{ fontFamily: 'monospace' }}
              >
                About
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 md:mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              What is
              <br />
              <span className="text-[#FFC20E]">KIIT Nexus</span>?
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              KIIT Nexus is a campus-exclusive innovation community at KIIT
              where passionate students come together to build impactful projects,
              learn practically, and support each other&#39;s growth.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 md:gap-4"
        >
          {[
            { num: '50+', label: 'Active Members' },
            { num: '10+', label: 'Live Projects' },
            { num: '3+', label: 'Domains' },
            { num: '∞', label: 'Opportunities' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 md:p-6 border border-white/5 rounded-xl bg-white/[0.02] hover:border-[#FFC20E]/20 transition-colors duration-300"
            >
              <div
                className="text-3xl md:text-4xl font-black text-[#FFC20E] mb-1"
                style={{ fontFamily: 'monospace' }}
              >
                {stat.num}
              </div>
              <div
                className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest"
                style={{ fontFamily: 'monospace' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function GroupPhoto() {
  return (
    <section className="relative w-full bg-black py-6 md:py-10 px-4 md:px-16 flex justify-center z-20">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="relative w-full max-w-6xl h-[260px] sm:h-[380px] md:h-[500px] lg:h-[600px] overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}
      >
        <img
          src={GROUP_PHOTO}
          alt="KIIT Nexus Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-3 leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Built by Students,
              <br />
              for Students
            </h3>
            <p className="text-gray-300 text-sm md:text-base max-w-lg">
              Join a community of builders, dreamers, and doers shaping the
              future at KIIT.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFC20E]" />
      </motion.div>
    </section>
  )
}


const projectData = [
  {
    title: 'KIIT QUEST',
    description:
      'The ultimate gamified campus exploration experience. Complete quests, find hidden spots, and top the leaderboard.',
    tech: ['Flutter', 'Node.js', 'MongoDB'],
    status: 'Live',
    link: 'https://kiit-quest-web.vercel.app/',
    logo: 'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771706066/930c0499-2516-4ad3-a9a7-a8d14a183fcb.png',
    isFeatured: true,
    // author: 'Abhishek Dhal',
    isTeam: false,
  },
  {
    title: 'TestForge',
    description:
      'A real-time student networking ecosystem built to enhance collaboration and mentorship across campus.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL'],
    status: 'Ongoing',
    link: '#',
    logo: null,
    author: 'TEAM CodeHunters',
    isTeam: true,
  },
  {
    title: 'AI Resume Scanner',
    description:
      'Machine-learning powered resume analysis system for smarter internship and placement preparation.',
    tech: ['Python', 'FastAPI', 'TensorFlow'],
    status: 'Ongoing',
    link: '#',
    logo: null,
    author: 'Team NovaX',
    isTeam: true,
  },
]

function Projects() {
  return (
    <section
      id="projects"
      className="relative z-10 py-20 md:py-32 px-4 md:px-16 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-12 md:mb-20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#FFC20E]" />
          <span
            className="text-[#FFC20E] text-xs font-bold tracking-[0.3em] uppercase"
            style={{ fontFamily: 'monospace' }}
          >
            Projects
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Be Project Ready
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '1.5px rgba(255,194,14,0.6)' }}
            >
              For Placements
            </span>
          </h2>
          <p
            className="text-gray-500 text-sm max-w-xs"
            style={{ fontFamily: 'monospace' }}
          >
            Real products built by Nexus members. Build something meaningful.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {projectData.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`group relative p-6 md:p-8 border transition-all duration-500 overflow-hidden flex flex-col rounded-2xl backdrop-blur-sm
              ${project.isFeatured
                ? 'bg-[#FFC20E]/8 border-[#FFC20E]/30 hover:border-[#FFC20E]/70'
                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
              }`}
          >
            {project.isFeatured && (
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFC20E]/15 rounded-full blur-3xl" />
            )}
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                {project.logo ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-[#FFC20E]/40 shadow-[0_0_15px_rgba(255,194,14,0.15)] hover:scale-105 transition-transform"
                  >
                    <img
                      src={project.logo}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <div className="w-5 h-5 bg-gradient-to-tr from-[#FFC20E] to-[#b08600] rounded-full" />
                  </div>
                )}
                <span
                  className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm border ${project.status === 'Live'
                      ? 'bg-[#FFC20E] text-black border-[#FFC20E]'
                      : 'bg-white/5 text-gray-500 border-white/5'
                    }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {project.status}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white group-hover:text-[#FFC20E] transition-colors flex items-center gap-2">
                {project.title}
                {project.link !== '#' && (
                  <FiExternalLink className="text-xs opacity-40" />
                )}
              </h3>
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-600 uppercase tracking-wide">
                {project.isTeam ? <FiUsers /> : <FiUser />}
                <span style={{ fontFamily: 'monospace' }}>
                  {project.author}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 md:mb-8 flex-grow">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5 md:mb-6">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-[10px] bg-black/50 border border-white/8 text-gray-500 rounded-sm"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="pt-4 md:pt-5 border-t border-white/5 flex items-center justify-between mt-auto">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-neutral-800 border border-black/80 flex items-center justify-center text-[9px] text-gray-600"
                    >
                      U{i}
                    </div>
                  ))}
                </div>
                <a
                  href={project.link}
                  target={project.link !== '#' ? '_blank' : '_self'}
                  className={`text-xs font-bold flex items-center gap-1.5 hover:gap-3 transition-all ${project.isFeatured ? 'text-[#FFC20E]' : 'text-white/50 hover:text-white'}`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {project.isFeatured ? 'LAUNCH APP' : 'DETAILS'} <span>→</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-12 md:mt-16 flex justify-center"
      >
        <a href="/projects">
          <SpotlightButton
            className="px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white font-bold text-xs md:text-sm tracking-widest uppercase rounded-sm backdrop-blur-sm transition-colors"
            overlayColor="rgba(255,194,14,0.15)"
          >
            <span className="group-hover:text-black transition-colors">Show More Projects ➔</span>
          </SpotlightButton>
        </a>
      </motion.div>
    </section>
  )
}


export default function Landing() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black text-white selection:bg-[#FFC20E]/30">
      <ParticlesBackground />
      <Glow />
      <Navbar />

      <Hero imgIndex={index} />
      <Ticker />
      <Ticker />
      <About />
      <GroupPhoto />
      <Projects />
      <Members />
      <Contact />
    </div>
  )
}