"use client"

import { useState, useEffect } from "react"
import { api, type VideoStatistic } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FadeIn, StaggerChildren } from "@/components/gsap-animations"
import { Eye, ThumbsUp, MessageSquare, TrendingUp, Search, RefreshCw } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

export default function AdminAnalyticsPage() {
  const [videoId, setVideoId] = useState("")
  const [stats, setStats] = useState<VideoStatistic | null>(null)
  const [loading, setLoading] = useState(false)
  const [historicalData, setHistoricalData] = useState<any[]>([])

  useEffect(() => {
    // Load mock historical data
    setHistoricalData([
      { date: "Mon", views: 12000, likes: 800, comments: 120 },
      { date: "Tue", views: 15000, likes: 950, comments: 145 },
      { date: "Wed", views: 18000, likes: 1100, comments: 180 },
      { date: "Thu", views: 14000, likes: 870, comments: 130 },
      { date: "Fri", views: 22000, likes: 1400, comments: 220 },
      { date: "Sat", views: 25000, likes: 1600, comments: 250 },
      { date: "Sun", views: 20000, likes: 1300, comments: 200 },
    ])
  }, [])

  const handleFetchStats = async () => {
    if (!videoId.trim()) return
    setLoading(true)
    try {
      const data = await api.getVideoStats(videoId)
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      // Mock data
      setStats({
        id: 1,
        courseId: 1,
        views: 125000 + Math.floor(Math.random() * 10000),
        likes: 8500 + Math.floor(Math.random() * 1000),
        comments: 1200 + Math.floor(Math.random() * 200),
        fetchedAt: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const overallStats = [
    {
      title: "Total Views",
      value: "1.2M",
      change: "+12%",
      icon: Eye,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Likes",
      value: "85K",
      change: "+8%",
      icon: ThumbsUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Comments",
      value: "12K",
      change: "+15%",
      icon: MessageSquare,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Engagement Rate",
      value: "8.2%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Monitor video statistics and platform metrics</p>
      </FadeIn>

      {/* Overall Stats */}
      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <span className="text-xs text-green-500">{stat.change}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </StaggerChildren>

      {/* Video Stats Lookup */}
      <FadeIn>
        <Card>
          <CardHeader>
            <CardTitle>Video Statistics Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter YouTube Video ID..."
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && handleFetchStats()}
                />
              </div>
              <Button onClick={handleFetchStats} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Fetch Stats"}
              </Button>
            </div>

            {stats && (
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
                    <p className="text-muted-foreground">Views</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{stats.likes.toLocaleString()}</div>
                    <p className="text-muted-foreground">Likes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                    <div className="text-2xl font-bold">{stats.comments.toLocaleString()}</div>
                    <p className="text-muted-foreground">Comments</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <FadeIn>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn direction="right">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="likes" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="comments" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
