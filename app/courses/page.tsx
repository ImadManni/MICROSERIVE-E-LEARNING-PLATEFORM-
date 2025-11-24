"use client"

import { useState, useEffect } from "react"
import { api, type Course, type Category } from "@/lib/api"
import { CourseCard } from "@/components/course-card"
import { YouTubeVideoCard } from "@/components/youtube-video-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FadeIn } from "@/components/gsap-animations"
import { Search, Filter, Loader2, Youtube, BookOpen } from "lucide-react"

interface YouTubeVideo {
  id: string | { videoId: string }
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium?: { url: string }
      high?: { url: string }
      default?: { url: string }
    }
    channelTitle: string
    publishedAt: string
  }
  statistics?: {
    viewCount: string
    likeCount: string
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [youtubeLoading, setYoutubeLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [activeTab, setActiveTab] = useState<"courses" | "youtube">("courses")

  useEffect(() => {
    loadCategories()
    loadCourses()
  }, [])

  useEffect(() => {
    loadCourses()
  }, [currentPage, sortBy])

  const loadCategories = async () => {
    const data = await api.getCategories()
    setCategories(data)
  }

  const loadCourses = async () => {
    setLoading(true)
    const response = await api.getCourses(currentPage, 12, sortBy, "DESC")
    setCourses(response.content)
    setTotalPages(response.totalPages)
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCourses()
      setYoutubeVideos([])
      setActiveTab("courses")
      return
    }
    
    // Search both courses and YouTube videos
    setLoading(true)
    setYoutubeLoading(true)
    
    try {
      // Search courses
      const coursesResponse = await api.searchCourses(searchQuery, 0, 12)
      setCourses(coursesResponse.content)
      setTotalPages(coursesResponse.totalPages)
      
      // Search YouTube videos
      const videos = await searchYouTubeVideos(searchQuery)
      
      // Switch to appropriate tab based on results
      if (coursesResponse.content.length > 0 && (!videos || videos.length === 0)) {
        setActiveTab("courses")
      } else if (coursesResponse.content.length === 0 && videos && videos.length > 0) {
        setActiveTab("youtube")
      } else if (coursesResponse.content.length > 0 && videos && videos.length > 0) {
        setActiveTab("courses") // Default to courses if both have results
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
      setYoutubeLoading(false)
    }
  }

  const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(
        `${API_BASE_URL}/api/stats/search?q=${encodeURIComponent(query)}&maxResults=12`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        if (data.items && Array.isArray(data.items)) {
          setYoutubeVideos(data.items)
          return data.items
        }
      }
      
      // Fallback to direct YouTube API
      return await searchYouTubeDirect(query)
    } catch (error) {
      console.error("Failed to search YouTube videos:", error)
      // Fallback to direct YouTube API
      return await searchYouTubeDirect(query)
    }
  }

  const searchYouTubeDirect = async (query: string): Promise<YouTubeVideo[]> => {
    const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    if (!YOUTUBE_API_KEY) {
      console.warn("YouTube API key not configured")
      return []
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`,
      )

      if (response.ok) {
        const data = await response.json()
        if (data.items && Array.isArray(data.items)) {
          setYoutubeVideos(data.items)
          return data.items
        }
      }
      return []
    } catch (error) {
      console.error("YouTube API error:", error)
      return []
    }
  }

  const filteredCourses =
    selectedCategory === "all" ? courses : courses.filter((c) => c.category?.name === selectedCategory)

  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover a wide range of courses taught by expert instructors
          </p>
        </FadeIn>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Course Grid / YouTube Videos */}
        {loading || youtubeLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : searchQuery.trim() ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "courses" | "youtube")} className="mb-8">
            {(filteredCourses.length > 0 || youtubeVideos.length > 0) && (
              <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-8">
                <TabsTrigger value="courses" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Courses ({filteredCourses.length})
                </TabsTrigger>
                <TabsTrigger value="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube Videos ({youtubeVideos.length})
                </TabsTrigger>
              </TabsList>
            )}
            <TabsContent value="courses" className="mt-0">
              {filteredCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <CourseCard key={course.id} course={course} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-xl text-muted-foreground mb-4">No courses found for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try searching YouTube videos or clear your search
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      loadCourses()
                      setYoutubeVideos([])
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="youtube" className="mt-0">
              {youtubeVideos.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {youtubeVideos.map((video, index) => {
                    const videoId = typeof video.id === "string" ? video.id : video.id.videoId
                    return <YouTubeVideoCard key={videoId} video={video} index={index} />
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Youtube className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-xl text-muted-foreground mb-4">No YouTube videos found for "{searchQuery}"</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      loadCourses()
                      setYoutubeVideos([])
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : filteredCourses.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No courses found</p>
            <Button
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                loadCourses()
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
