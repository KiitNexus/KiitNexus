'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const scrollToSection = (id: string) => {
    // If not on the homepage, route back to the homepage section
    if (pathname !== '/') {
      router.push(`/#${id}`)
      return
    }
    
    // If on the homepage, smooth scroll to the section
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    if (pathname !== '/') {
      router.push('/')
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-sm bg-white/5 border border-white/10 px-8 py-3 rounded-full shadow-lg flex items-center gap-8"
    >
      {/* LOGO */}
      <button
        onClick={scrollToTop}
        className="font-bold tracking-wide text-yellow-400 cursor-pointer hover:scale-105 transition"
      >
        NEXUS
      </button>

      {/* NAV LINKS */}
      <div className="hidden md:flex gap-6 text-sm text-gray-300">
        <button
          onClick={() => scrollToSection('about')}
          className="hover:text-white transition-colors"
        >
          About
        </button>
        <button
          onClick={() => scrollToSection('events')}
          className="hover:text-white transition-colors"
        >
          Events
        </button>
        <button
          onClick={() => scrollToSection('community')}
          className="hover:text-white transition-colors"
        >
          Community
        </button>
        
        {/* Updated to a Next.js Link for the new page */}
        <Link
          href="/opportunities"
          className="hover:text-white transition-colors"
        >
          Opportunities
        </Link>
      </div>

      <button className="ml-4 px-5 py-2 rounded-full bg-yellow-500 text-black text-sm font-semibold hover:bg-yellow-400 transition">
        Login
      </button>

    </motion.nav>
  )
}