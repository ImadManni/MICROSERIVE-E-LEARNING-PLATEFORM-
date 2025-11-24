"use client"

import { useState, useEffect } from "react"
import { api, type Course, type Category, type Professor } from "@/lib/api"
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
import { Plus, Pencil, Trash2, Search, Loader2, Youtube } from "lucide-react"
import { YouTubeVideoSearch } from "@/components/youtube-video-search"

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    professorId: "",
    youtubeVideoId: "",
    price: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [coursesRes, catsRes, profsRes] = await Promise.all([
        api.getCourses(0, 100),
        api.getCategories(),
        api.getProfessors(),
      ])
      setCourses(coursesRes.content)
      setCategories(catsRes)
      setProfessors(profsRes)
    } catch (error) {
      console.error("Failed to load data:", error)
      // Mock data
      setCourses([
        {
          id: 1,
          title: "Web Development Bootcamp",
          description: "Complete web dev course",
          categoryId: 1,
          professorId: 1,
          youtubeVideoId: "dQw4w9WgXcQ",
          price: 99.99,
          createdAt: "2024-01-01",
          category: { id: 1, name: "Web Development", description: "" },
          professor: { id: 1, fullName: "John Doe", email: "", bio: "", avatarUrl: "" },
        },
        {
          id: 2,
          title: "Python Masterclass",
          description: "Learn Python programming",
          categoryId: 2,
          professorId: 2,
          youtubeVideoId: "rfscVS0vtbw",
          price: 79.99,
          createdAt: "2024-01-15",
          category: { id: 2, name: "Data Science", description: "" },
          professor: { id: 2, fullName: "Jane Smith", email: "", bio: "", avatarUrl: "" },
        },
        {
          id: 3,
          title: "UI/UX Design Fundamentals",
          description: "Design beautiful interfaces",
          categoryId: 3,
          professorId: 3,
          youtubeVideoId: "c9Wg6Cb_YlU",
          price: 89.99,
          createdAt: "2024-02-01",
          category: { id: 3, name: "Design", description: "" },
          professor: { id: 3, fullName: "Mike Johnson", email: "", bio: "", avatarUrl: "" },
        },
      ])
      setCategories([
        { id: 1, name: "Web Development", description: "" },
        { id: 2, name: "Data Science", description: "" },
        { id: 3, name: "Design", description: "" },
      ])
      setProfessors([
        { id: 1, fullName: "John Doe", email: "john@example.com", bio: "", avatarUrl: "" },
        { id: 2, fullName: "Jane Smith", email: "jane@example.com", bio: "", avatarUrl: "" },
        { id: 3, fullName: "Mike Johnson", email: "mike@example.com", bio: "", avatarUrl: "" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        title: course.title,
        description: course.description,
        categoryId: course.categoryId.toString(),
        professorId: course.professorId.toString(),
        youtubeVideoId: course.youtubeVideoId,
        price: course.price.toString(),
      })
    } else {
      setEditingCourse(null)
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        professorId: "",
        youtubeVideoId: "",
        price: "",
      })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        categoryId: Number(formData.categoryId),
        professorId: Number(formData.professorId),
        youtubeVideoId: formData.youtubeVideoId,
        price: Number(formData.price),
      }

      if (editingCourse) {
        await api.updateCourse(editingCourse.id, courseData)
      } else {
        await api.createCourse(courseData)
      }

      setDialogOpen(false)
      loadData()
    } catch (error) {
      console.error("Failed to save course:", error)
      // For demo, update locally
      if (editingCourse) {
        setCourses(
          courses.map((c) =>
            c.id === editingCourse.id
              ? {
                  ...c,
                  ...formData,
                  categoryId: Number(formData.categoryId),
                  professorId: Number(formData.professorId),
                  price: Number(formData.price),
                }
              : c,
          ),
        )
      } else {
        const newCourse: Course = {
          id: Date.now(),
          title: formData.title,
          description: formData.description,
          categoryId: Number(formData.categoryId),
          professorId: Number(formData.professorId),
          youtubeVideoId: formData.youtubeVideoId,
          price: Number(formData.price),
          createdAt: new Date().toISOString(),
          category: categories.find((c) => c.id === Number(formData.categoryId)),
          professor: professors.find((p) => p.id === Number(formData.professorId)),
        }
        setCourses([...courses, newCourse])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return

    try {
      await api.deleteCourse(id)
      loadData()
    } catch (error) {
      console.error("Failed to delete course:", error)
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))

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
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Manage your course catalog</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
                <DialogDescription>
                  {editingCourse ? "Update course information" : "Create a new course"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Course title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Course description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="professor">Professor</Label>
                    <Select
                      value={formData.professorId}
                      onValueChange={(value) => setFormData({ ...formData, professorId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select professor" />
                      </SelectTrigger>
                      <SelectContent>
                        {professors.map((prof) => (
                          <SelectItem key={prof.id} value={prof.id.toString()}>
                            {prof.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="youtubeVideoId" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube Video
                    </Label>
                    <div className="space-y-2">
                      <YouTubeVideoSearch
                        onSelectVideo={(videoId, title) => {
                          setFormData({ ...formData, youtubeVideoId: videoId })
                        }}
                        selectedVideoId={formData.youtubeVideoId}
                      />
                      {formData.youtubeVideoId && (
                        <div className="p-3 bg-muted rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="font-mono text-xs">
                                {formData.youtubeVideoId}
                              </Badge>
                              <span className="text-xs text-muted-foreground">Selected</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => setFormData({ ...formData, youtubeVideoId: "" })}
                            >
                              Clear
                            </Button>
                          </div>
                          <div className="aspect-video bg-black rounded overflow-hidden">
                            <img
                              src={`https://img.youtube.com/vi/${formData.youtubeVideoId}/maxresdefault.jpg`}
                              alt="Video thumbnail"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${formData.youtubeVideoId}/default.jpg`
                              }}
                            />
                          </div>
                          <a
                            href={`https://www.youtube.com/watch?v=${formData.youtubeVideoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <Youtube className="h-3 w-3" />
                            Preview on YouTube
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="99.99"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingCourse ? "Update" : "Create"}
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
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredCourses.length} courses</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.category?.name || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>{course.professor?.fullName || "N/A"}</TableCell>
                      <TableCell>${course.price.toFixed(2)}</TableCell>
                      <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(course)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No courses found
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
