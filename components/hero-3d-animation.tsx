"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { GraduationCap, BookOpen, Laptop, Award, PlayCircle, Users } from "lucide-react"

export function Hero3DAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !sceneRef.current || typeof window === "undefined") return

    const elements = sceneRef.current.children
    const mouse = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    // Mouse move handler for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animate elements with GSAP
    const ctx = gsap.context(() => {
      // Floating animations for each element
      Array.from(elements).forEach((el, index) => {
        const element = el as HTMLElement
        const delay = index * 0.2
        // Use index-based values instead of Math.random() for consistent hydration
        const duration = 3 + (index % 3) * 0.5
        const yOffset = 20 + (index % 4) * 7

        // Initial position - use index-based values
        gsap.set(element, {
          rotationX: -15 + (index % 5) * 6,
          rotationY: -15 + (index % 4) * 7,
          rotationZ: -10 + (index % 3) * 6,
        })

        // Floating animation
        gsap.to(element, {
          y: `+=${yOffset}`,
          rotationX: "+=10",
          rotationY: "+=15",
          duration: duration,
          delay: delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      })

      // Parallax effect on mouse move
      gsap.to(target, {
        x: () => mouse.x * 15,
        y: () => mouse.y * 15,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          gsap.to(sceneRef.current, {
            rotationY: target.x * 0.5,
            rotationX: -target.y * 0.5,
            duration: 0.5,
            ease: "power2.out",
          })
        },
        repeat: -1,
      })
    }, containerRef)

    return () => {
      ctx.revert()
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const elements = [
    { Icon: GraduationCap, position: { x: -100, y: -80, z: 0 }, color: "text-primary", bg: "bg-primary/20", size: "w-16 h-16 md:w-20 md:h-20" },
    { Icon: BookOpen, position: { x: 100, y: -60, z: -60 }, color: "text-blue-500", bg: "bg-blue-500/20", size: "w-14 h-14 md:w-16 md:h-16" },
    { Icon: Laptop, position: { x: -60, y: 60, z: 60 }, color: "text-green-500", bg: "bg-green-500/20", size: "w-16 h-16 md:w-20 md:h-20" },
    { Icon: Award, position: { x: 80, y: 80, z: -40 }, color: "text-yellow-500", bg: "bg-yellow-500/20", size: "w-14 h-14 md:w-16 md:h-16" },
    { Icon: PlayCircle, position: { x: -120, y: 0, z: 40 }, color: "text-purple-500", bg: "bg-purple-500/20", size: "w-14 h-14 md:w-16 md:h-16" },
    { Icon: Users, position: { x: 120, y: -100, z: 30 }, color: "text-pink-500", bg: "bg-pink-500/20", size: "w-14 h-14 md:w-16 md:h-16" },
  ]

  return (
    <div ref={containerRef} className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] perspective-1000 overflow-visible">
      <div
        ref={sceneRef}
        className="relative w-full h-full preserve-3d"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {elements.map((item, index) => {
          const Icon = item.Icon
          return (
            <div
              key={index}
              className="absolute preserve-3d"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate3d(${item.position.x}px, ${item.position.y}px, ${item.position.z}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`${item.bg} ${item.color} rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md border border-white/30 hover:border-white/50 transition-all duration-300`}
                style={{
                  transform: "translateZ(0)",
                  transformStyle: "preserve-3d",
                }}
              >
                <Icon className={item.size} />
              </div>
            </div>
          )
        })}

        {/* Central glowing orb */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-primary/40 blur-3xl"
          style={{
            transform: "translateZ(-150px)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        
        {/* Additional glow effects */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 blur-2xl"
          style={{
            transform: "translateZ(-80px)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  )
}

