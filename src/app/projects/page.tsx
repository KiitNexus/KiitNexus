'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiUsers, FiUser, FiGithub, FiFileText, FiGlobe, FiX, FiCalendar, FiChevronRight } from 'react-icons/fi'
import Glow from '@/components/Glow'
import Link from 'next/link'


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
  const activeLink = 'projects'

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


const coreProjects = [
  {
    title: 'KIIT QUEST',
    description:
      'The ultimate gamified campus exploration experience. Complete quests, find hidden spots, and top the leaderboard.',
    tech: ['Flutter', 'Node.js', 'MongoDB'],
    domain: 'App Development',
    status: 'Live',
    link: 'https://kiit-quest-web.vercel.app/',
    logo: 'https://res.cloudinary.com/da9zvp0mu/image/upload/v1771706066/930c0499-2516-4ad3-a9a7-a8d14a183fcb.png',
    isFeatured: true,
    author: 'Abhishek Dhal',
    isTeam: false,
    deadline: null,
    githubLink: null,
    documentationLink: null,
    deployedLink: 'https://kiit-quest-web.vercel.app/',
    teamMembers: [{ name: 'Abhishek Dhal' }],
  },
  {
    title: 'TestForge',
    description:
      'A real-time student networking ecosystem built to enhance collaboration and mentorship across campus.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL'],
    domain: 'Web Development',
    status: 'Ongoing',
    link: '#',
    logo: null,
    author: 'TEAM CodeHunters',
    isTeam: true,
    deadline: null,
    githubLink: null,
    documentationLink: null,
    deployedLink: null,
    teamMembers: [{ name: 'TEAM CodeHunters' }],
  },
  {
    title: 'AI Resume Scanner',
    description:
      'Machine-learning powered resume analysis system for smarter internship and placement preparation.',
    tech: ['Python', 'FastAPI', 'TensorFlow'],
    domain: 'Machine Learning',
    status: 'Ongoing',
    link: '#',
    logo: null,
    author: 'Team NovaX',
    isTeam: true,
    deadline: null,
    githubLink: null,
    documentationLink: null,
    deployedLink: null,
    teamMembers: [{ name: 'Team NovaX' }],
  }
]

function getInitials(name: string): string {
  if (!name) return '?'
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}

const AVATAR_COLORS = [
  ['#FFC20E', '#b08600'],
  ['#4F9BFF', '#1E4F91'],
  ['#FF6B6B', '#8C1F1F'],
  ['#6BCB77', '#1F6B2E'],
  ['#C56BFF', '#5B1F8C'],
  ['#FF9F4F', '#8C4A1F'],
]

function getAvatarColors(name: string): [string, string] {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index] as [string, string]
}

function formatDeadline(dateStr: string | null): string | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getDaysLeft(dateStr: string | null): string | null {
  if (!dateStr) return null
  const deadline = new Date(dateStr)
  if (isNaN(deadline.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)
  const diffDays = Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays > 1) return `${diffDays} days left`
  if (diffDays === 1) return '1 day left'
  if (diffDays === 0) return 'Due today'
  return 'Overdue'
}

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<any[]>(coreProjects)
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'All' | 'Ongoing' | 'Completed'>('All')
  const [selectedProject, setSelectedProject] = useState<any | null>(null)

  useEffect(() => {
    async function fetchLiveProjects() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nexus-workspace-backend.vercel.app/api/projects'
        const response = await fetch(API_URL)
        const result = await response.json()

        if (result.success && result.data && result.data.length > 0) {
          const liveData = result.data.map((p: any) => ({
            title: p.projectName,
            description: p.about,
            tech: p.domain ? [p.domain] : ['Web Dev'],
            domain: p.domain || null,
            status: p.isCompleted ? 'Live' : 'Ongoing',
            link: p.deployedLink || p.githubLink || p.documentationLink || '#',
            logo: p.projectLogoUrl || null,
            author: p.leadId?.name || 'Nexus Developer',
            isTeam: p.members && p.members.length > 0,
            isFeatured: false,
            deadline: p.deadline || null,
            githubLink: p.githubLink || null,
            documentationLink: p.documentationLink || null,
            deployedLink: p.deployedLink || null,
            teamMembers: [
              ...(p.leadId ? [{ name: p.leadId.name }] : []),
              ...(p.members || []).map((m: any) => ({ name: m.name })),
            ],
          }))

          setProjects([...coreProjects, ...liveData])
        }
      } catch (error) {
        console.log('Backend not actively running locally.', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLiveProjects()
  }, [])

  return (
    <div className="bg-black text-white selection:bg-[#FFC20E]/30 min-h-screen overflow-x-hidden w-full relative">
      <ParticlesBackground />
      <Glow />
      <Navbar />

      <section
        className="relative z-10 pt-28 pb-16 md:py-32 px-5 sm:px-6 md:px-16 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#FFC20E]" />
            <span
              className="text-[#FFC20E] text-xs font-bold tracking-[0.3em] uppercase"
              style={{ fontFamily: 'monospace' }}
            >
              All Submissions
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] md:leading-tight tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Discover
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: 'max(1px, 0.05em) rgba(255,194,14,0.6)' }}
              >
                Innovation
              </span>
            </h2>
            <p
              className="text-gray-500 text-sm max-w-xs"
              style={{ fontFamily: 'monospace' }}
            >
              A showcase of brilliant ideas and applications submitted by the Nexus community.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mt-6">
            <div className="flex bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md w-full sm:w-auto overflow-x-auto no-scrollbar">
              {['All', 'Ongoing', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab as any)}
                  className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-2.5 sm:py-2 text-[11px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-full ${activeFilter === tab
                      ? 'text-black bg-[#FFC20E] shadow-md'
                      : 'text-gray-400 hover:text-white'
                    }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {projects
            .filter((project) => {
              if (activeFilter === 'All') return true
              if (activeFilter === 'Ongoing') return project.status === 'Ongoing'
              if (activeFilter === 'Completed') return project.status === 'Live' || project.status === 'Completed'
              return true
            })
            .map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                className={`group relative p-6 md:p-8 border transition-all duration-500 overflow-hidden flex flex-col rounded-2xl backdrop-blur-xl cursor-pointer
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
                        onClick={(e) => e.stopPropagation()}
                        className="block w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-[#FFC20E]/40 shadow-[0_0_15px_rgba(255,194,14,0.15)] hover:scale-105 transition-transform"
                      >
                        <img
                          src={project.logo}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ) : (
                      <div
                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-white/10 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${getAvatarColors(project.title)[0]}33, ${getAvatarColors(project.title)[1]}33)`,
                        }}
                      >
                        <span
                          className="text-sm md:text-base font-black tracking-wide"
                          style={{
                            fontFamily: 'monospace',
                            color: getAvatarColors(project.title)[0],
                          }}
                        >
                          {getInitials(project.title)}
                        </span>
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
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-600 uppercase tracking-wide">
                    {project.isTeam ? <FiUsers /> : <FiUser />}
                    <span style={{ fontFamily: 'monospace' }}>
                      {project.author}
                    </span>
                  </div>
                  {formatDeadline(project.deadline) && (
                    <div className="text-[11px] text-gray-600 mb-4" style={{ fontFamily: 'monospace' }}>
                      Deadline: {formatDeadline(project.deadline)}
                    </div>
                  )}
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 md:mb-8 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5 md:mb-6">
                    {project.tech.map((t: string, i: number) => (
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
                      {(project.teamMembers || []).slice(0, 3).map((member: { name: string }, i: number) => (
                        <div
                          key={i}
                          title={member.name}
                          className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-neutral-800 border border-black/80 flex items-center justify-center text-[9px] text-gray-400"
                          style={{ fontFamily: 'monospace' }}
                        >
                          {getInitials(member.name)}
                        </div>
                      ))}
                      {(project.teamMembers || []).length > 3 && (
                        <div
                          className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-black border border-black/80 flex items-center justify-center text-[9px] text-gray-500"
                          style={{ fontFamily: 'monospace' }}
                        >
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                    {project.isFeatured ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold flex items-center gap-1.5 hover:gap-3 transition-all text-[#FFC20E]"
                        style={{ fontFamily: 'monospace' }}
                      >
                        LAUNCH APP <span>→</span>
                      </a>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProject(project)
                        }}
                        className="text-xs font-bold flex items-center gap-1.5 hover:gap-3 transition-all text-white/50 hover:text-white"
                        style={{ fontFamily: 'monospace' }}
                      >
                        DETAILS <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-lg max-h-[90dvh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden bg-neutral-950/95 backdrop-blur-2xl border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl overscroll-contain shadow-[0_0_60px_rgba(255,194,14,0.08)]"
            >
              <div
                className="absolute inset-0 rounded-t-3xl sm:rounded-2xl overflow-hidden"
                aria-hidden="true"
              >
                <ParticlesBackground />
                <Glow />
              </div>

              <div className="sm:hidden sticky top-0 z-20 flex justify-center pt-2.5 pb-1 bg-neutral-950/95 backdrop-blur">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="relative h-24 sm:h-36 flex items-end justify-center p-4 sm:p-6">
                <div className="absolute inset-0 overflow-hidden rounded-t-3xl sm:rounded-t-2xl bg-gradient-to-br from-[#FFC20E]/20 via-black/0 to-black/0 pointer-events-none">
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#FFC20E]/15 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-32 sm:h-40 bg-[#FFC20E]/25 rounded-full blur-3xl" />
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 hover:shadow-[0_0_15px_rgba(255,194,14,0.15)] active:scale-95 transition-all z-10"
                  aria-label="Close"
                >
                  <FiX />
                </button>
                {selectedProject.logo ? (
                  <img
                    src={selectedProject.logo}
                    alt={selectedProject.title}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover border border-[#FFC20E]/40 shadow-[0_0_25px_rgba(255,194,14,0.35)] drop-shadow-[0_0_12px_rgba(255,194,14,0.5)] absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 z-10"
                  />
                ) : (
                  <div
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl border border-white/10 flex items-center justify-center absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 shadow-[0_0_25px_rgba(255,194,14,0.35)] drop-shadow-[0_0_12px_rgba(255,194,14,0.5)] z-10"
                    style={{
                      background: `linear-gradient(135deg, ${getAvatarColors(selectedProject.title)[0]}, ${getAvatarColors(selectedProject.title)[1]})`,
                    }}
                  >
                    <span
                      className="text-base sm:text-xl font-black tracking-wide text-black"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {getInitials(selectedProject.title)}
                    </span>
                  </div>
                )}
              </div>

              <div
                className="relative z-10 pt-11 sm:pt-14 px-4 sm:px-6 pb-6 sm:pb-8 text-center"
                style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
              >
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 tracking-tight break-words"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {selectedProject.title}
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                  {selectedProject.domain && (
                    <span
                      className="px-2 py-1 text-[10px] bg-black/50 border border-white/8 text-[#FFC20E] rounded-sm uppercase tracking-widest"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {selectedProject.domain}
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm border ${selectedProject.status === 'Live'
                        ? 'bg-[#FFC20E] text-black border-[#FFC20E] shadow-[0_0_15px_rgba(255,194,14,0.15)]'
                        : 'bg-white/5 text-gray-500 border-white/5'
                      }`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {selectedProject.status}
                  </span>
                </div>

                {formatDeadline(selectedProject.deadline) && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-2 text-xs sm:text-sm text-white/80">
                    <FiCalendar className="text-[#FFC20E] shrink-0" />
                    <span style={{ fontFamily: 'monospace' }}>
                      {formatDeadline(selectedProject.deadline)}
                    </span>
                    <span
                      className="text-[#FFC20E] text-xs font-semibold"
                      style={{ fontFamily: 'monospace' }}
                    >
                      ({getDaysLeft(selectedProject.deadline)})
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 mb-5 sm:mb-6 text-[11px] sm:text-xs text-gray-600 uppercase tracking-wide max-w-full px-2">
                  {selectedProject.isTeam ? <FiUsers className="shrink-0" /> : <FiUser className="shrink-0" />}
                  <span className="truncate" style={{ fontFamily: 'monospace' }}>
                    Lead: {(selectedProject.teamMembers?.[0]?.name || selectedProject.author || '').toUpperCase()}
                  </span>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="h-px w-8 bg-[#FFC20E]" />
                    <span
                      className="text-[#FFC20E] text-xs font-bold tracking-[0.3em] uppercase"
                      style={{ fontFamily: 'monospace' }}
                    >
                      About Project
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 sm:mb-8">
                    {selectedProject.description}
                  </p>

                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="h-px w-8 bg-[#FFC20E]" />
                  <span
                    className="text-[#FFC20E] text-xs font-bold tracking-[0.3em] uppercase"
                    style={{ fontFamily: 'monospace' }}
                  >
                    Project Links
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,194,14,0.1)] transition-all duration-300 active:scale-[0.98]"
                    >
                      <FiGithub className="text-base text-gray-500 group-hover:text-[#FFC20E] transition-colors shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-white text-xs font-bold uppercase tracking-wide"
                          style={{ fontFamily: 'monospace' }}
                        >
                          GitHub Repository
                        </p>
                        <p className="text-gray-600 text-xs truncate mt-0.5" style={{ fontFamily: 'monospace' }}>
                          {selectedProject.githubLink}
                        </p>
                      </div>
                      <FiChevronRight className="text-white/20 group-hover:text-[#FFC20E] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </a>
                  )}
                  {selectedProject.documentationLink && (
                    <a
                      href={selectedProject.documentationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,194,14,0.1)] transition-all duration-300 active:scale-[0.98]"
                    >
                      <FiFileText className="text-base text-gray-500 group-hover:text-[#FFC20E] transition-colors shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-white text-xs font-bold uppercase tracking-wide"
                          style={{ fontFamily: 'monospace' }}
                        >
                          Documentation Link
                        </p>
                        <p className="text-gray-600 text-xs truncate mt-0.5" style={{ fontFamily: 'monospace' }}>
                          {selectedProject.documentationLink}
                        </p>
                      </div>
                      <FiChevronRight className="text-white/20 group-hover:text-[#FFC20E] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </a>
                  )}
                  {selectedProject.deployedLink && (
                    <a
                      href={selectedProject.deployedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,194,14,0.1)] transition-all duration-300 active:scale-[0.98]"
                    >
                      <FiGlobe className="text-base text-gray-500 group-hover:text-[#FFC20E] transition-colors shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-white text-xs font-bold uppercase tracking-wide"
                          style={{ fontFamily: 'monospace' }}
                        >
                          Deployed / Live Link
                        </p>
                        <p className="text-gray-600 text-xs truncate mt-0.5" style={{ fontFamily: 'monospace' }}>
                          {selectedProject.deployedLink}
                        </p>
                      </div>
                      <FiChevronRight className="text-white/20 group-hover:text-[#FFC20E] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </a>
                  )}
                  {!selectedProject.githubLink && !selectedProject.documentationLink && !selectedProject.deployedLink && (
                    <p className="text-gray-600 text-xs italic" style={{ fontFamily: 'monospace' }}>
                      No links added yet.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="h-px w-8 bg-[#FFC20E]" />
                  <span
                    className="text-[#FFC20E] text-xs font-bold tracking-[0.3em] uppercase"
                    style={{ fontFamily: 'monospace' }}
                  >
                    Domain
                  </span>
                </div>
                <span
                  className="inline-block px-3 py-1.5 text-[10px] bg-black/50 border border-white/8 text-gray-400 rounded-sm uppercase tracking-widest"
                  style={{ fontFamily: 'monospace' }}
                >
                  {selectedProject.domain || (selectedProject.tech && selectedProject.tech[0]) || 'General'}
                </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
