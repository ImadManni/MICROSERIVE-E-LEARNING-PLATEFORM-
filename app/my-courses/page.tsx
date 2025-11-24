"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { api, type Enrollment } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/gsap-animations"
import { motion } from "framer-motion"
import { BookOpen, Play, Award, Clock, CheckCircle } from "lucide-react"

function MyCoursesContent() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEnrollments()
  }, [])

  const loadEnrollments = async () => {
    try {
      const data = await api.getMyEnrollments()
      setEnrollments(data)
    } catch (error) {
      console.error("Failed to load enrollments:", error)
      // Mock data
      setEnrollments([
        {
          id: 1,
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
            professor: { id: 1, fullName: "John Doe", email: "", bio: "", avatarUrl: "" },
          },
        },
        {
          id: 2,
          studentId: 1,
          courseId: 2,
          enrollmentDate: "2024-02-01",
          progress: 30,
          course: {
            id: 2,
            title: "Python for Data Science",
            description: "Master Python and data analysis",
            categoryId: 2,
            professorId: 2,
            youtubeVideoId: "rfscVS0vtbw",
            price: 79.99,
            createdAt: "2024-01-15",
            professor: { id: 2, fullName: "Jane Smith", email: "", bio: "", avatarUrl: "" },
          },
        },
        {
          id: 3,
          studentId: 1,
          courseId: 3,
          enrollmentDate: "2024-01-01",
          progress: 100,
          course: {
            id: 3,
            title: "JavaScript Fundamentals",
            description: "Learn JavaScript from scratch",
            categoryId: 1,
            professorId: 1,
            youtubeVideoId: "PkZNo7MFNFg",
            price: 49.99,
            createdAt: "2023-12-01",
            professor: { id: 1, fullName: "John Doe", email: "", bio: "", avatarUrl: "" },
          },
        },
        {
          id: 4,
          studentId: 1,
          courseId: 4,
          enrollmentDate: "2024-02-15",
          progress: 0,
          course: {
            id: 4,
            title: "React Advanced Patterns",
            description: "Advanced React concepts and patterns",
            categoryId: 1,
            professorId: 3,
            youtubeVideoId: "c9Wg6Cb_YlU",
            price: 89.99,
            createdAt: "2024-02-01",
            professor: { id: 3, fullName: "Mike Johnson", email: "", bio: "", avatarUrl: "" },
          },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100)
  const completed = enrollments.filter((e) => e.progress === 100)
  const notStarted = enrollments.filter((e) => e.progress === 0)

  const CourseCard = ({ enrollment, index }: { enrollment: Enrollment; index: number }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative">
          {enrollment.course?.youtubeVideoId ? (
            <img
              src={`https://img.youtube.com/vi/${enrollment.course.youtubeVideoId}/maxresdefault.jpg`}
              alt={enrollment.course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {enrollment.progress === 100 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{enrollment.course?.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{enrollment.course?.description}</p>

          {enrollment.course?.professor && (
            <p className="text-sm text-muted-foreground mb-4">By {enrollment.course.professor.fullName}</p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
            </span>
            <Button size="sm" asChild>
              <Link href={`/my-courses/${enrollment.id}`}>
                {enrollment.progress === 0 ? (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </>
                ) : enrollment.progress === 100 ? (
                  <>
                    <Award className="h-4 w-4 mr-1" />
                    Certificate
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Continue
                  </>
                )}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <FadeIn className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">Track your learning progress and continue where you left off.</p>
      </FadeIn>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({enrollments.length})</TabsTrigger>
          <TabsTrigger value="in-progress">
            <Clock className="h-4 w-4 mr-1" />
            In Progress ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="not-started">
            <BookOpen className="h-4 w-4 mr-1" />
            Not Started ({notStarted.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {enrollments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment, index) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="in-progress">
          {inProgress.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgress.map((enrollment, index) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState message="No courses in progress" />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completed.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completed.map((enrollment, index) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState message="No completed courses yet" />
          )}
        </TabsContent>

        <TabsContent value="not-started">
          {notStarted.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notStarted.map((enrollment, index) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState message="All your courses are started!" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ message = "You haven't enrolled in any courses yet" }: { message?: string }) {
  return (
    <div className="text-center py-16">
      <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{message}</h3>
      <p className="text-muted-foreground mb-6">Start learning something new today!</p>
      <Button asChild>
        <Link href="/courses">Browse Courses</Link>
      </Button>
    </div>
  )
}

export default function MyCoursesPage() {
  return (
    <ProtectedRoute>
      <MyCoursesContent />
    </ProtectedRoute>
  )
}
