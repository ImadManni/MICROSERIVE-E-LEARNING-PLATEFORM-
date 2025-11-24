"use client"

import { useState, useEffect } from "react"
import { api, type Professor } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FadeIn } from "@/components/gsap-animations"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"

export default function AdminProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    avatarUrl: "",
  })

  useEffect(() => {
    loadProfessors()
  }, [])

  const loadProfessors = async () => {
    try {
      const data = await api.getProfessors()
      setProfessors(data)
    } catch (error) {
      console.error("Failed to load professors:", error)
      setProfessors([
        {
          id: 1,
          fullName: "John Doe",
          email: "john@example.com",
          bio: "Senior Software Engineer with 10+ years experience",
          avatarUrl: "",
        },
        {
          id: 2,
          fullName: "Jane Smith",
          email: "jane@example.com",
          bio: "Data Scientist and Machine Learning Expert",
          avatarUrl: "",
        },
        {
          id: 3,
          fullName: "Mike Johnson",
          email: "mike@example.com",
          bio: "UI/UX Designer and Creative Director",
          avatarUrl: "",
        },
        {
          id: 4,
          fullName: "Sarah Wilson",
          email: "sarah@example.com",
          bio: "Digital Marketing Strategist",
          avatarUrl: "",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (professor?: Professor) => {
    if (professor) {
      setEditingProfessor(professor)
      setFormData({
        fullName: professor.fullName,
        email: professor.email,
        bio: professor.bio,
        avatarUrl: professor.avatarUrl,
      })
    } else {
      setEditingProfessor(null)
      setFormData({ fullName: "", email: "", bio: "", avatarUrl: "" })
    }
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingProfessor) {
        await api.updateProfessor(editingProfessor.id, formData)
      } else {
        await api.createProfessor(formData)
      }
      setDialogOpen(false)
      loadProfessors()
    } catch (error) {
      console.error("Failed to save professor:", error)
      if (editingProfessor) {
        setProfessors(professors.map((p) => (p.id === editingProfessor.id ? { ...p, ...formData } : p)))
      } else {
        setProfessors([...professors, { id: Date.now(), ...formData }])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this professor?")) return
    try {
      await api.deleteProfessor(id)
      loadProfessors()
    } catch (error) {
      console.error("Failed to delete professor:", error)
      setProfessors(professors.filter((p) => p.id !== id))
    }
  }

  const filteredProfessors = professors.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <h1 className="text-3xl font-bold">Professors</h1>
            <p className="text-muted-foreground">Manage instructor profiles</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Professor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingProfessor ? "Edit Professor" : "Add New Professor"}</DialogTitle>
                <DialogDescription>
                  {editingProfessor ? "Update professor information" : "Create a new professor profile"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief description..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingProfessor ? "Update" : "Create"}
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
                placeholder="Search professors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">{filteredProfessors.length} professors</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Professor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.length > 0 ? (
                  filteredProfessors.map((professor) => (
                    <TableRow key={professor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={professor.avatarUrl || "/placeholder.svg"} />
                            <AvatarFallback>
                              {professor.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{professor.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{professor.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{professor.bio}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(professor)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(professor.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No professors found
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
