"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { api, type Course, type Lesson, type VideoStatistic } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FadeIn } from "@/components/gsap-animations"
import { YouTubePlayer } from "@/components/youtube-player"
import { motion } from "framer-motion"
import { Play, Clock, User, BookOpen, Star, Eye, ThumbsUp, MessageSquare, CheckCircle, Lock } from "lucide-react"

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [stats, setStats] = useState<VideoStatistic | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    setLoading(true)
    try {
      const courseData = await api.getCourseById(Number(id))
      setCourse(courseData)

      const lessonsData = await api.getLessonsByCourse(Number(id))
      setLessons(lessonsData)

      if (courseData.youtubeVideoId) {
        try {
          const statsData = await api.getVideoStats(courseData.youtubeVideoId)
          setStats(statsData)
        } catch (error) {
          console.error("Failed to load video stats:", error)
          // Try to fetch stats via course ID
          try {
            const courseStats = await api.getCourseStats(Number(id))
            setStats(courseStats)
          } catch (e) {
            console.error("Failed to load course stats:", e)
          }
        }
      }
    } catch (error) {
      console.error("Failed to load course:", error)
      // Mock data for demo
      setCourse({
        id: Number(id),
        title: "Complete Web Development Bootcamp",
        description:
          "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course. This course will take you from beginner to professional web developer with hands-on projects and real-world examples.",
        categoryId: 1,
        professorId: 1,
        youtubeVideoId: "dQw4w9WgXcQ",
        price: 99.99,
        createdAt: new Date().toISOString(),
        category: { id: 1, name: "Web Development", description: "" },
        professor: {
          id: 1,
          fullName: "John Doe",
          email: "john@example.com",
          bio: "Senior Software Engineer with 10+ years of experience in web development. Passionate about teaching and helping others learn to code.",
          avatarUrl: "",
        },
      })
      setLessons([
        {
          id: 1,
          title: "Introduction to Web Development",
          content: "Overview of web technologies",
          duration: 15,
          courseId: Number(id),
        },
        { id: 2, title: "HTML Fundamentals", content: "Learning HTML structure", duration: 45, courseId: Number(id) },
        { id: 3, title: "CSS Styling Basics", content: "Styling your web pages", duration: 60, courseId: Number(id) },
        {
          id: 4,
          title: "JavaScript Essentials",
          content: "Programming fundamentals",
          duration: 90,
          courseId: Number(id),
        },
        {
          id: 5,
          title: "Building Your First Website",
          content: "Hands-on project",
          duration: 120,
          courseId: Number(id),
        },
      ])
      setStats({
        id: 1,
        courseId: Number(id),
        views: 125000,
        likes: 8500,
        comments: 1200,
        fetchedAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setEnrolling(true)
    try {
      await api.enrollInCourse(Number(id))
      router.push("/my-courses")
    } catch (error) {
      console.error("Failed to enroll:", error)
      alert("Failed to enroll in course. Please try again.")
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
      </div>
    )
  }

  const totalDuration = lessons.reduce((acc, lesson) => acc + lesson.duration, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Video */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Content - Course Info */}
            <div className="lg:col-span-6 space-y-5">
              <FadeIn>
                <div className="space-y-4">
                  {course.category && (
                    <Badge variant="secondary" className="text-sm">
                      {course.category.name}
                    </Badge>
                  )}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{course.title}</h1>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{course.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-3">
                  {course.professor && (
                    <div className="flex items-center gap-3">
                      <img
                        src={course.professor.avatarUrl || `/placeholder.svg?height=48&width=48&query=professor avatar`}
                        alt={course.professor.fullName}
                        className="w-12 h-12 rounded-full border-2 border-background"
                      />
                      <div>
                        <p className="font-semibold text-sm">{course.professor.fullName}</p>
                        <p className="text-xs text-muted-foreground">Instructor</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">4.8</span>
                    <span className="text-xs text-muted-foreground">(2,345)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>12,500 students</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Side - Video Player & Enrollment */}
            <div className="lg:col-span-6">
              <FadeIn direction="right">
                <Card className="overflow-hidden shadow-xl border">
                  {/* Large Video Player */}
                  <div className="relative w-full">
                    <YouTubePlayer 
                      videoId={course.youtubeVideoId} 
                      title={course.title}
                      className="rounded-none"
                      onError={(error) => {
                        setVideoError(error)
                        console.error("YouTube player error:", error)
                      }}
                    />
                    {videoError && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-t">
                        <p className="text-xs text-yellow-800 dark:text-yellow-200">
                          {videoError}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Enrollment Section */}
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${course.price > 0 ? course.price.toFixed(2) : "Free"}</span>
                      {course.price > 0 && (
                        <span className="text-sm text-muted-foreground line-through">$149.99</span>
                      )}
                    </div>

                    <Button 
                      className="w-full h-12 text-base font-semibold" 
                      size="lg" 
                      onClick={handleEnroll} 
                      disabled={enrolling}
                    >
                      {enrolling ? "Enrolling..." : isAuthenticated ? "Enroll Now" : "Sign In to Enroll"}
                    </Button>

                    <div className="space-y-3 pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>Lessons</span>
                        </div>
                        <span className="font-medium">{lessons.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Total length</span>
                        </div>
                        <span className="font-medium">
                          {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4" />
                          <span>Certificate</span>
                        </div>
                        <span className="font-medium text-green-600 dark:text-green-400">Included</span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-center text-muted-foreground">
                      30-day money-back guarantee
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            <Tabs defaultValue="curriculum" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Course Content</h2>
                  <p className="text-muted-foreground">
                    {lessons.length} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total length
                  </p>
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                        onClick={() => {
                          if (isAuthenticated) {
                            // Navigate to lesson if enrolled
                            router.push(`/my-courses/${id}`)
                          } else {
                            router.push("/login")
                          }
                        }}
                      >
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base mb-1">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">{lesson.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">{lesson.duration} min</span>
                            {index > 1 ? (
                              <Lock className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Play className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                {course.professor && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <img
                          src={
                            course.professor.avatarUrl ||
                            `/placeholder.svg?height=100&width=100&query=professor portrait`
                          }
                          alt={course.professor.fullName}
                          className="w-24 h-24 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{course.professor.fullName}</h3>
                          <p className="text-muted-foreground mb-4">{course.professor.email}</p>
                          <p className="text-muted-foreground">{course.professor.bio}</p>

                          <div className="flex gap-6 mt-4 text-sm">
                            <div>
                              <span className="font-bold">15</span>
                              <span className="text-muted-foreground ml-1">Courses</span>
                            </div>
                            <div>
                              <span className="font-bold">50,000+</span>
                              <span className="text-muted-foreground ml-1">Students</span>
                            </div>
                            <div>
                              <span className="font-bold">4.8</span>
                              <span className="text-muted-foreground ml-1">Rating</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                <h2 className="text-2xl font-bold">Video Statistics</h2>
                {stats ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
                        <p className="text-muted-foreground">Views</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{stats.likes.toLocaleString()}</div>
                        <p className="text-muted-foreground">Likes</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{stats.comments.toLocaleString()}</div>
                        <p className="text-muted-foreground">Comments</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No statistics available</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - What You'll Learn */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="sticky top-24 shadow-md">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-xl font-bold">What You&apos;ll Learn</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {[
                  "Build real-world web applications",
                  "Master modern JavaScript and ES6+",
                  "Create responsive designs with CSS",
                  "Work with databases and APIs",
                  "Deploy applications to production",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-xl font-bold">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span className="text-sm text-muted-foreground">No prior programming experience required</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span className="text-sm text-muted-foreground">A computer with internet access</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span className="text-sm text-muted-foreground">Willingness to learn and practice</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
