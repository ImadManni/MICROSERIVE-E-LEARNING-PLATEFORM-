"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { api, type Enrollment, type Lesson } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/gsap-animations"
import { YouTubePlayer } from "@/components/youtube-player"
import { motion } from "framer-motion"
import { Play, CheckCircle, Clock, ArrowLeft, Download, Lock } from "lucide-react"

export default function LessonViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEnrollmentData()
  }, [id])

  const loadEnrollmentData = async () => {
    try {
      // In real app, fetch enrollment by ID
      const enrollments = await api.getMyEnrollments()
      const found = enrollments.find((e) => e.id === Number(id))
      if (found) {
        setEnrollment(found)
        if (found.courseId) {
          const lessonData = await api.getLessonsByCourse(found.courseId)
          setLessons(lessonData)
        }
      }
    } catch (error) {
      console.error("Failed to load enrollment:", error)
      // Mock data
      setEnrollment({
        id: Number(id),
        studentId: 1,
        courseId: 1,
        enrollmentDate: "2024-01-15",
        progress: 65,
        course: {
          id: 1,
          title: "Complete Web Development Bootcamp",
          description: "Learn HTML, CSS, JavaScript, React, Node.js",
          categoryId: 1,
          professorId: 1,
          youtubeVideoId: "dQw4w9WgXcQ",
          price: 99.99,
          createdAt: "2024-01-01",
        },
      })
      setLessons([
        {
          id: 1,
          title: "Introduction to Web Development",
          content: "Overview of web technologies and what you'll learn in this course.",
          duration: 15,
          courseId: 1,
        },
        {
          id: 2,
          title: "HTML Fundamentals",
          content: "Learning HTML structure, elements, and semantic markup.",
          duration: 45,
          courseId: 1,
        },
        {
          id: 3,
          title: "CSS Styling Basics",
          content: "Styling your web pages with CSS properties and selectors.",
          duration: 60,
          courseId: 1,
        },
        {
          id: 4,
          title: "JavaScript Essentials",
          content: "Programming fundamentals with JavaScript.",
          duration: 90,
          courseId: 1,
        },
        {
          id: 5,
          title: "DOM Manipulation",
          content: "Interacting with web pages using JavaScript.",
          duration: 45,
          courseId: 1,
        },
        {
          id: 6,
          title: "Building Your First Website",
          content: "Hands-on project combining HTML, CSS, and JavaScript.",
          duration: 120,
          courseId: 1,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProgress = async (lessonIndex: number) => {
    const newProgress = Math.round(((lessonIndex + 1) / lessons.length) * 100)
    try {
      if (enrollment) {
        await api.updateProgress(enrollment.id, newProgress)
        setEnrollment({ ...enrollment, progress: newProgress })
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
    }
  }

  const completedLessons = enrollment ? Math.floor((enrollment.progress / 100) * lessons.length) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Enrollment Not Found</h1>
        <Button onClick={() => router.push("/my-courses")}>Back to My Courses</Button>
      </div>
    )
  }

  const currentLesson = lessons[currentLessonIndex]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-16 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/my-courses")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-semibold">{enrollment.course?.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{enrollment.progress}% complete</span>
                  <span>•</span>
                  <span>
                    {completedLessons}/{lessons.length} lessons
                  </span>
                </div>
              </div>
            </div>
            <Progress value={enrollment.progress} className="w-32 h-2" />
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player & Content */}
          <div className="lg:col-span-2 space-y-6">
            <FadeIn>
              {/* Video Player */}
              <Card className="overflow-hidden">
                <YouTubePlayer 
                  videoId={enrollment.course?.youtubeVideoId} 
                  title={currentLesson?.title || enrollment.course?.title || "Video"}
                  autoplay={false}
                />
              </Card>

              {/* Lesson Content */}
              {currentLesson && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          Lesson {currentLessonIndex + 1} of {lessons.length}
                        </Badge>
                        <CardTitle>{currentLesson.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{currentLesson.duration} min</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{currentLesson.content}</p>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                        disabled={currentLessonIndex === 0}
                      >
                        Previous Lesson
                      </Button>

                      {currentLessonIndex < lessons.length - 1 ? (
                        <Button
                          onClick={() => {
                            handleUpdateProgress(currentLessonIndex)
                            setCurrentLessonIndex(currentLessonIndex + 1)
                          }}
                        >
                          Mark Complete & Next
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleUpdateProgress(currentLessonIndex)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Course
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </FadeIn>
          </div>

          {/* Sidebar - Lessons List */}
          <div>
            <FadeIn direction="right">
              <Card className="sticky top-36">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[500px] overflow-y-auto">
                    {lessons.map((lesson, index) => {
                      const isCompleted = index < completedLessons
                      const isCurrent = index === currentLessonIndex
                      const isLocked = index > completedLessons

                      return (
                        <motion.button
                          key={lesson.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => !isLocked && setCurrentLessonIndex(index)}
                          disabled={isLocked}
                          className={`w-full p-4 text-left border-b last:border-b-0 flex items-center gap-3 transition-colors ${
                            isCurrent ? "bg-primary/10" : isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : isCurrent
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : isLocked ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <span className="text-sm">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : ""}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{lesson.duration} min</p>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {enrollment.progress === 100 && (
                <Card className="mt-4 bg-green-500/10 border-green-500">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Congratulations!</h3>
                    <p className="text-sm text-muted-foreground mb-4">You&apos;ve completed this course!</p>
                    <Button className="bg-green-500 hover:bg-green-600">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              )}
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
