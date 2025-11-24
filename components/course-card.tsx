"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/api"
import { Clock, User, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

interface CourseCardProps {
  course: Course
  index?: number
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.youtubeVideoId ? (
            <img
              src={`https://img.youtube.com/vi/${course.youtubeVideoId}/maxresdefault.jpg`}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <img
              src={`/.jpg?height=200&width=400&query=${encodeURIComponent(course.title)}`}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {course.category && (
            <Badge className="absolute top-3 left-3" variant="secondary">
              {course.category.name}
            </Badge>
          )}
        </div>

        <CardContent className="flex-1 p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{course.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {course.professor && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{course.professor.fullName}</span>
              </div>
            )}
            {course.lessons && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.lessons.length} lessons</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-1 font-bold text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>{course.price > 0 ? course.price.toFixed(2) : "Free"}</span>
          </div>
          <Button asChild size="sm">
            <Link href={`/courses/${course.id}`}>View Course</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
