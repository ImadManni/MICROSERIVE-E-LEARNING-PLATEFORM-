"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { api, type Enrollment, type Course } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FadeIn, StaggerChildren } from "@/components/gsap-animations"
import { motion } from "framer-motion"
import { BookOpen, Clock, Award, TrendingUp, Play, ArrowRight, GraduationCap } from "lucide-react"

function DashboardContent() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [recentCourses, setRecentCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const enrollmentData = await api.getMyEnrollments()
      setEnrollments(enrollmentData)

      const coursesResponse = await api.getCourses(0, 4)
      setRecentCourses(coursesResponse.content)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      // Mock data for demo
      setEnrollments([
        {
          id: 1,
          studentId: 1,
          courseId: 1,
          enrollmentDate: new Date().toISOString(),
          progress: 65,
          course: {
            id: 1,
            title: "Complete Web Development Bootcamp",
            description: "Learn full-stack web development",
            categoryId: 1,
            professorId: 1,
            youtubeVideoId: "dQw4w9WgXcQ",
            price: 99.99,
            createdAt: new Date().toISOString(),
          },
        },
        {
          id: 2,
          studentId: 1,
          courseId: 2,
          enrollmentDate: new Date().toISOString(),
          progress: 30,
          course: {
            id: 2,
            title: "Python for Data Science",
            description: "Master Python and data analysis",
            categoryId: 2,
            professorId: 2,
            youtubeVideoId: "rfscVS0vtbw",
            price: 79.99,
            createdAt: new Date().toISOString(),
          },
        },
        {
          id: 3,
          studentId: 1,
          courseId: 3,
          enrollmentDate: new Date().toISOString(),
          progress: 100,
          course: {
            id: 3,
            title: "JavaScript Fundamentals",
            description: "Learn JavaScript from scratch",
            categoryId: 1,
            professorId: 1,
            youtubeVideoId: "PkZNo7MFNFg",
            price: 49.99,
            createdAt: new Date().toISOString(),
          },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrollments.length,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "In Progress",
      value: enrollments.filter((e) => e.progress > 0 && e.progress < 100).length,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Completed",
      value: enrollments.filter((e) => e.progress === 100).length,
      icon: Award,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Avg Progress",
      value:
        enrollments.length > 0
          ? `${Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)}%`
          : "0%",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <FadeIn className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || "Student"}!</h1>
            <p className="text-muted-foreground">Continue your learning journey where you left off.</p>
          </div>
          <Button asChild>
            <Link href="/courses">
              Browse Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </StaggerChildren>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <FadeIn>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Continue Learning</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/my-courses">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollments.filter((e) => e.progress < 100).length > 0 ? (
                  enrollments
                    .filter((e) => e.progress < 100)
                    .slice(0, 3)
                    .map((enrollment, index) => (
                      <motion.div
                        key={enrollment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {enrollment.course?.youtubeVideoId ? (
                            <img
                              src={`https://img.youtube.com/vi/${enrollment.course.youtubeVideoId}/default.jpg`}
                              alt={enrollment.course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{enrollment.course?.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={enrollment.progress} className="h-2 flex-1" />
                            <span className="text-sm text-muted-foreground">{enrollment.progress}%</span>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/my-courses/${enrollment.id}`}>
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </Link>
                        </Button>
                      </motion.div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No courses in progress</p>
                    <Button asChild>
                      <Link href="/courses">Start Learning</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Achievements */}
        <div>
          <FadeIn direction="right">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollments.filter((e) => e.progress === 100).length > 0 ? (
                  enrollments
                    .filter((e) => e.progress === 100)
                    .map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                        <Award className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="font-medium text-sm">{enrollment.course?.title}</p>
                          <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <Award className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Complete courses to earn certificates</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/my-courses">
                    <Clock className="mr-2 h-4 w-4" />
                    My Learning
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/certificates">
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
