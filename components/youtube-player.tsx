"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface YouTubePlayerProps {
  videoId: string | null | undefined
  title?: string
  autoplay?: boolean
  className?: string
  onError?: (error: string) => void
}

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function YouTubePlayer({ videoId, title = "Video", autoplay = false, className = "", onError }: YouTubePlayerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!videoId) {
      setError("No video ID provided")
      setLoading(false)
      return
    }

    // Clean video ID (remove URL parts if present)
    const cleanVideoId = videoId.includes("youtube.com") || videoId.includes("youtu.be")
      ? extractVideoId(videoId)
      : videoId.trim()

    if (!cleanVideoId) {
      setError("Invalid YouTube video ID")
      setLoading(false)
      if (onError) onError("Invalid YouTube video ID")
      return
    }

    // Validate video ID format (YouTube IDs are 11 characters)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(cleanVideoId)) {
      setError("Invalid YouTube video ID format (must be 11 characters)")
      setLoading(false)
      if (onError) onError("Invalid YouTube video ID format")
      return
    }

    setLoading(true)
    setError(null)
    setIsPlaying(false)

    // Check if video exists by loading thumbnail
    const img = new Image()
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000) // Timeout after 5 seconds

    img.onload = () => {
      clearTimeout(timeout)
      setLoading(false)
    }
    img.onerror = () => {
      clearTimeout(timeout)
      setError("Video not found or unavailable")
      setLoading(false)
      if (onError) onError("Video not found or unavailable")
    }
    img.src = `https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`
  }, [videoId, onError])

  const handlePlay = () => {
    setIsPlaying(true)
    setLoading(false)
  }

  if (!videoId) {
    return (
      <div className={`aspect-video bg-black flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No video available</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`aspect-video bg-black flex items-center justify-center ${className}`}>
        <div className="text-center text-white p-6">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-sm mb-2">{error}</p>
          <p className="text-xs text-gray-400">Video ID: {videoId}</p>
        </div>
      </div>
    )
  }

  // Clean video ID for embed
  const cleanVideoId = videoId.includes("youtube.com") || videoId.includes("youtu.be")
    ? extractVideoId(videoId) || videoId
    : videoId.trim()

  // Get origin safely for SSR
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const embedUrl = `https://www.youtube.com/embed/${cleanVideoId}?${
    autoplay ? "autoplay=1&" : ""
  }rel=0&modestbranding=1&playsinline=1&enablejsapi=1&controls=1&showinfo=0${origin ? `&origin=${origin}` : ""}`

  return (
    <div className={`aspect-video bg-black relative overflow-hidden rounded-lg ${className}`}>
      {loading && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {!isPlaying && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="text-center text-white">
            <img
              src={`https://img.youtube.com/vi/${extractVideoId(videoId) || videoId}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white/90 hover:bg-white text-black"
                onClick={handlePlay}
              >
                <Play className="h-6 w-6 fill-current" />
                Play Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {(isPlaying || autoplay) && (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => {
            setLoading(false)
            setIsPlaying(true)
          }}
          onError={() => {
            setError("Failed to load video")
            setLoading(false)
            if (onError) onError("Failed to load video")
          }}
        />
      )}
    </div>
  )
}

