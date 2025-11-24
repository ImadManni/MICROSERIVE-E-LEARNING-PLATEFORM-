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
        const statsData = await api.getVideoStats(courseData.youtubeVideoId)
        setStats(statsData)
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
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-muted/50 py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <FadeIn>
                {course.category && (
                  <Badge variant="secondary" className="mb-2">
                    {course.category.name}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                <p className="text-lg text-muted-foreground">{course.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {course.professor && (
                    <div className="flex items-center gap-2">
                      <img
                        src={course.professor.avatarUrl || `/placeholder.svg?height=40&width=40&query=professor avatar`}
                        alt={course.professor.fullName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{course.professor.fullName}</p>
                        <p className="text-muted-foreground">Instructor</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-muted-foreground">(2,345 ratings)</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>12,500 students</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Enrollment Card */}
            <FadeIn direction="right">
              <Card className="sticky top-24">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  {course.youtubeVideoId ? (
                    <img
                      src={`https://img.youtube.com/vi/${course.youtubeVideoId}/maxresdefault.jpg`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={`/.jpg?height=200&width=400&query=${encodeURIComponent(course.title)}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <Play className="h-5 w-5" />
                      Preview Course
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="text-3xl font-bold">${course.price > 0 ? course.price.toFixed(2) : "Free"}</div>

                  <Button className="w-full" size="lg" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? "Enrolling..." : isAuthenticated ? "Enroll Now" : "Sign In to Enroll"}
                  </Button>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total length
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="curriculum" className="space-y-6">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="space-y-4">
                <h2 className="text-2xl font-bold">Course Content</h2>
                <p className="text-muted-foreground">
                  {lessons.length} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total length
                </p>

                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">{lesson.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{lesson.duration} min</span>
                            {index > 1 ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Play className="h-4 w-4 text-primary" />
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What You&apos;ll Learn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Build real-world web applications",
                  "Master modern JavaScript and ES6+",
                  "Create responsive designs with CSS",
                  "Work with databases and APIs",
                  "Deploy applications to production",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• No prior programming experience required</p>
                <p>• A computer with internet access</p>
                <p>• Willingness to learn and practice</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
