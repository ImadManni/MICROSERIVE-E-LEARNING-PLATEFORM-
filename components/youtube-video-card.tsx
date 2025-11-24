"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Play, Clock, Eye, ExternalLink, Youtube } from "lucide-react"
import Link from "next/link"

interface YouTubeVideoCardProps {
  video: {
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
  index?: number
}

export function YouTubeVideoCard({ video, index = 0 }: YouTubeVideoCardProps) {
  const videoId = typeof video.id === "string" ? video.id : video.id.videoId
  const thumbnailUrl =
    video.snippet.thumbnails.medium?.url ||
    video.snippet.thumbnails.high?.url ||
    video.snippet.thumbnails.default?.url ||
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  const formatViews = (views: string | undefined) => {
    if (!views) return "N/A"
    const num = parseInt(views)
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`
    return `${num} views`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays < 30) return `${diffDays} days ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
      return `${Math.floor(diffDays / 365)} years ago`
    } catch {
      return dateString
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnailUrl}
            alt={video.snippet.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="h-8 w-8 text-primary fill-primary" />
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-none">
              <Youtube className="h-3 w-3 mr-1" />
              YouTube
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {video.snippet.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{video.snippet.description}</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{formatViews(video.statistics?.viewCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(video.snippet.publishedAt)}</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-4">
            <span className="font-medium">Channel:</span> {video.snippet.channelTitle}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            asChild
          >
            <Link href={`/courses?youtube=${videoId}`}>
              <Play className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

