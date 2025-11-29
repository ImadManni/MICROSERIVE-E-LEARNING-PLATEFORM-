"use client"

import { useState, useEffect } from "react"
import { api, type Lesson, type Course } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/gsap-animations"
import { Plus, Pencil, Trash2, Search, Loader2, Clock } from "lucide-react"

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    duration: "",
    courseId: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const coursesRes = await api.getCourses(0, 100)
      setCourses(coursesRes.content)
      // Load lessons from all courses
      const allLessons: Lesson[] = []
      for (const course of coursesRes.content.slice(0, 5)) {
        const courseLessons = await api.getLessonsByCourse(course.id)
        allLessons.push(...courseLessons)
      }
      setLessons(allLessons)
    } catch (error) {
      console.error("Failed to load data:", error)
      setCourses([
        {
          id: 1,
          title: "Web Development Bootcamp",
          description: "",
          categoryId: 1,
          professorId: 1,
          youtubeVideoId: "",
          price: 99,
          createdAt: "",
        },
        {
          id: 2,
          title: "Python Masterclass",
          description: "",
          categoryId: 2,
          professorId: 2,
          youtubeVideoId: "",
          price: 79,
          createdAt: "",
        },
      ])
      setLessons([
        { id: 1, title: "Introduction to HTML", content: "Learn HTML basics", duration: 30, courseId: 1 },
        { id: 2, title: "CSS Fundamentals", content: "Styling web pages", duration: 45, courseId: 1 },
        { id: 3, title: "JavaScript Basics", content: "Programming fundamentals", duration: 60, courseId: 1 },
        { id: 4, title: "Python Setup", content: "Installing Python", duration: 15, courseId: 2 },
        { id: 5, title: "Variables & Data Types", content: "Python data types", duration: 40, courseId: 2 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson)
      setFormData({
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration.toString(),
        courseId: lesson.courseId.toString(),
      })
    } else {
      setEditingLesson(null)
      setFormData({ title: "", content: "", duration: "", courseId: "" })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const lessonData = {
        title: formData.title,
        content: formData.content,
        duration: Number(formData.duration),
        courseId: formData.courseId,
      }
      if (editingLesson) {
        await api.updateLesson(editingLesson.id, lessonData)
      } else {
        await api.createLesson(lessonData)
      }
      setDialogOpen(false)
      loadData()
    } catch (error) {
      console.error("Failed to save lesson:", error)
      if (editingLesson) {
        setLessons(
          lessons.map((l) =>
            l.id === editingLesson.id
              ? { ...l, ...formData, duration: Number(formData.duration), courseId: formData.courseId }
              : l,
          ),
        )
      } else {
        setLessons([
          ...lessons,
          {
            id: String(Date.now()),
            title: formData.title,
            content: formData.content,
            duration: Number(formData.duration),
            courseId: formData.courseId,
          },
        ])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return
    try {
      await api.deleteLesson(id)
      loadData()
    } catch (error) {
      console.error("Failed to delete lesson:", error)
      setLessons(lessons.filter((l) => l.id !== id))
    }
  }

  const getCourseName = (courseId: number) => {
    return courses.find((c) => c.id === courseId)?.title || "Unknown"
  }

  const filteredLessons = lessons.filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Lessons</h1>
            <p className="text-muted-foreground">Manage course content</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
                <DialogDescription>
                  {editingLesson ? "Update lesson information" : "Create a new lesson"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="courseId">Course</Label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Lesson title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Lesson content/description"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingLesson ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredLessons.length} lessons</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">{lesson.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCourseName(lesson.courseId)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(lesson)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(lesson.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No lessons found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
