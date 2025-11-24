"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn, StaggerChildren, ScaleIn } from "@/components/gsap-animations"
import { gsap } from "gsap"
import { motion } from "framer-motion"
import { GraduationCap, Users, BookOpen, Award, Play, ArrowRight, CheckCircle, Star } from "lucide-react"

const features = [
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of real-world experience",
  },
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Engage with hands-on projects and real-world scenarios",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with fellow learners and get help when you need it",
  },
  {
    icon: Award,
    title: "Certification",
    description: "Earn recognized certificates upon successful course completion",
  },
]

const stats = [
  { value: "10K+", label: "Students" },
  { value: "500+", label: "Courses" },
  { value: "100+", label: "Instructors" },
  { value: "95%", label: "Success Rate" },
]

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        duration: 1,
        y: 60,
        opacity: 0,
        ease: "power3.out",
      })

      gsap.from(".hero-subtitle", {
        duration: 1,
        y: 40,
        opacity: 0,
        delay: 0.2,
        ease: "power3.out",
      })

      gsap.from(".hero-buttons", {
        duration: 1,
        y: 30,
        opacity: 0,
        delay: 0.4,
        ease: "power3.out",
      })

      gsap.from(".hero-image", {
        duration: 1.2,
        x: 100,
        opacity: 0,
        delay: 0.3,
        ease: "power3.out",
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Unlock Your Potential with <span className="text-primary">Expert-Led</span> Online Courses
              </h1>
              <p className="hero-subtitle text-xl text-muted-foreground max-w-lg text-pretty">
                Master new skills, advance your career, and achieve your goals with our comprehensive learning platform
                designed for success.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/courses">
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register">
                    <Play className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`/student-portrait.png?height=40&width=40&query=student portrait ${i}`}
                      alt={`Student ${i}`}
                      className="w-10 h-10 rounded-full border-2 border-background"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">Trusted by 10,000+ students</span>
                </div>
              </div>
            </div>

            <div className="hero-image relative">
              <div className="relative z-10">
                <img src="/online-learning-dashboard.png" alt="Learning Platform" className="rounded-2xl shadow-2xl" />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose LearnHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform offers everything you need to succeed in your learning journey
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScaleIn key={feature.title} delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Get started in three simple steps</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Create Account", desc: "Sign up for free and set up your profile" },
              { step: "02", title: "Choose Course", desc: "Browse our catalog and find the perfect course" },
              { step: "03", title: "Start Learning", desc: "Learn at your own pace with video lessons" },
            ].map((item, index) => (
              <FadeIn key={item.step} direction="up" delay={index * 0.2}>
                <div className="relative text-center">
                  <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <img src="/student-studying-laptop.png" alt="Student Learning" className="rounded-2xl shadow-xl" />
            </FadeIn>

            <FadeIn direction="right">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Learn from the Best, Achieve the Greatest</h2>
                <p className="text-lg text-muted-foreground">
                  Our platform provides you with all the tools and resources you need to succeed in your educational
                  journey.
                </p>

                <ul className="space-y-4">
                  {[
                    "Access to 500+ expert-led courses",
                    "Learn at your own pace, anytime, anywhere",
                    "Interactive quizzes and assessments",
                    "Certificate of completion",
                    "Lifetime access to course materials",
                  ].map((benefit) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button size="lg" asChild>
                  <Link href="/register">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning on LearnHub. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
