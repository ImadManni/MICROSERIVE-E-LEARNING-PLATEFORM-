"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GraduationCap, Menu, User, LogOut, BookOpen, LayoutDashboard, Settings } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const logoIconRef = useRef<HTMLDivElement>(null)
  const logoTextRef = useRef<HTMLSpanElement>(null)

  const isAdmin = user?.roles?.includes("ADMIN")
  const isProfessor = user?.roles?.includes("PROFESSOR")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Logo animation on mount
  useEffect(() => {
    if (logoIconRef.current && logoTextRef.current) {
      // Initial animation
      gsap.from(logoIconRef.current, {
        duration: 0.8,
        scale: 0,
        rotation: -180,
        opacity: 0,
        ease: "back.out(1.7)",
      })

      gsap.from(logoTextRef.current, {
        duration: 0.6,
        x: -20,
        opacity: 0,
        delay: 0.2,
        ease: "power3.out",
      })

      // Continuous floating animation
      gsap.to(logoIconRef.current, {
        y: -4,
        duration: 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })

      // Subtle rotation animation
      gsap.to(logoIconRef.current, {
        rotation: 5,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    }

    return () => {
      // Cleanup animations
      if (logoIconRef.current) {
        gsap.killTweensOf(logoIconRef.current)
      }
      if (logoTextRef.current) {
        gsap.killTweensOf(logoTextRef.current)
      }
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
          : "border-b border-transparent bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/50"
      }`}
    >
      <div className="container relative flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="flex items-center gap-2 flex-shrink-0 z-10 group relative"
          onMouseEnter={() => {
            if (logoIconRef.current) {
              gsap.killTweensOf(logoIconRef.current)
              gsap.to(logoIconRef.current, {
                scale: 1.2,
                rotation: 360,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.7)",
              })
            }
            if (logoTextRef.current) {
              gsap.to(logoTextRef.current, {
                x: 3,
                duration: 0.3,
                ease: "power2.out",
              })
            }
          }}
          onMouseLeave={() => {
            if (logoIconRef.current) {
              gsap.to(logoIconRef.current, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                  // Restart floating animation
                  gsap.to(logoIconRef.current, {
                    y: -4,
                    duration: 2.5,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                  })
                  gsap.to(logoIconRef.current, {
                    rotation: 5,
                    duration: 3,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                  })
                }
              })
            }
            if (logoTextRef.current) {
              gsap.to(logoTextRef.current, {
                x: 0,
                duration: 0.3,
                ease: "power2.out",
              })
            }
          }}
        >
          <div className="relative" ref={logoIconRef}>
            <GraduationCap 
              className="h-8 w-8 text-primary transition-all duration-300 group-hover:drop-shadow-lg group-hover:drop-shadow-primary/50" 
            />
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-150" />
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-125" />
          </div>
          <span 
            ref={logoTextRef}
            className="text-xl font-bold text-black dark:text-white transition-all duration-300"
          >
            LearnHub
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                Dashboard
              </Link>
              <Link href="/my-courses" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                My Courses
              </Link>
              {(isAdmin || isProfessor) && (
                <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0 z-10">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-courses" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Courses
                  </Link>
                </DropdownMenuItem>
                {(isAdmin || isProfessor) && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/my-courses"
                    className="px-4 py-2 hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Courses
                  </Link>
                  {(isAdmin || isProfessor) && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 hover:bg-muted rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="px-4 py-2 text-left text-destructive hover:bg-muted rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 hover:bg-muted rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
