"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Play, Check, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface YouTubeVideo {
  id: string | { videoId: string }
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium?: {
        url: string
      }
      high?: {
        url: string
      }
      default?: {
        url: string
      }
    }
    channelTitle: string
    publishedAt: string
  }
  statistics?: {
    viewCount: string
    likeCount: string
  }
}

interface YouTubeVideoSearchProps {
  onSelectVideo: (videoId: string, title: string) => void
  selectedVideoId?: string
  className?: string
}

export function YouTubeVideoSearch({ onSelectVideo, selectedVideoId, className = "" }: YouTubeVideoSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Debounce search
  const searchVideos = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setVideos([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Try to use backend API first
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(
          `${API_BASE_URL}/api/stats/search?q=${encodeURIComponent(query)}&maxResults=20`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          if (data.items && Array.isArray(data.items) && data.items.length > 0) {
            setVideos(data.items)
            return
          }
        }
        // Fallback to direct YouTube API if backend doesn't support search or returns empty
        await searchYouTubeDirect(query)
      } catch (err) {
        console.error("Failed to search videos:", err)
        // Fallback to direct YouTube API
        await searchYouTubeDirect(query)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // Direct YouTube API search (requires API key in env)
  const searchYouTubeDirect = async (query: string) => {
    const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    if (!YOUTUBE_API_KEY) {
      setError("YouTube API key not configured. Please set NEXT_PUBLIC_YOUTUBE_API_KEY")
      return
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch videos")
      }

      const data = await response.json()
      if (data.items) {
        setVideos(data.items)
      }
    } catch (err) {
      console.error("YouTube API error:", err)
      setError("Failed to search videos. Please check your API key.")
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchVideos(searchQuery)
      } else {
        setVideos([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, searchVideos])

  const handleSelectVideo = (video: YouTubeVideo) => {
    // Handle both search result format (id.videoId) and video detail format (id as string)
    const videoId = typeof video.id === "string" ? video.id : video.id.videoId
    onSelectVideo(videoId, video.snippet.title)
    setIsOpen(false)
    setSearchQuery("")
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const formatViews = (views: string | undefined) => {
    if (!views) return "N/A"
    const num = parseInt(views)
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`
    return `${num} views`
  }

  return (
    <div className={className}>
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search YouTube videos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              if (searchQuery.trim()) {
                searchVideos(searchQuery)
                setIsOpen(true)
              }
            }}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {isOpen && (videos.length > 0 || loading || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg max-h-[500px] overflow-y-auto"
            >
              {loading && (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Searching videos...</p>
                </div>
              )}

              {error && (
                <div className="p-4 text-center">
                  <p className="text-sm text-destructive">{error}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Make sure NEXT_PUBLIC_YOUTUBE_API_KEY is set in your environment
                  </p>
                </div>
              )}

              {!loading && !error && videos.length > 0 && (
                <div className="p-2 space-y-2">
                  {videos.map((video) => {
                    // Handle both search result format (id.videoId) and video detail format (id as string)
                    const videoId = typeof video.id === "string" ? video.id : video.id.videoId
                    const isSelected = videoId === selectedVideoId
                    const thumbnailUrl =
                      video.snippet.thumbnails.medium?.url ||
                      video.snippet.thumbnails.high?.url ||
                      video.snippet.thumbnails.default?.url ||
                      `https://img.youtube.com/vi/${videoId}/default.jpg`

                    return (
                      <motion.div
                        key={videoId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                      >
                        <Card
                          className={`hover:border-primary transition-all ${
                            isSelected ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => handleSelectVideo(video)}
                        >
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={thumbnailUrl}
                                  alt={video.snippet.title}
                                  className="w-32 h-24 object-cover rounded"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded">
                                  <Play className="h-6 w-6 text-white" />
                                </div>
                                {isSelected && (
                                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                                    <Check className="h-3 w-3" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm line-clamp-2 mb-1">{video.snippet.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                  {video.snippet.description}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>{video.snippet.channelTitle}</span>
                                  <span>•</span>
                                  <span>{formatDate(video.snippet.publishedAt)}</span>
                                  {video.statistics && (
                                    <>
                                      <span>•</span>
                                      <span>{formatViews(video.statistics.viewCount)}</span>
                                    </>
                                  )}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {videoId}
                                  </Badge>
                                  <a
                                    href={`https://www.youtube.com/watch?v=${videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Open on YouTube
                                  </a>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {!loading && !error && videos.length === 0 && searchQuery.trim() && (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No videos found</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false)
          }}
        />
      )}
    </div>
  )
}

