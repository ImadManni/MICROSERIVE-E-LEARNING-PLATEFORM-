"use client"

import { useState, useEffect } from "react"
import { api, type VideoStatistic } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeIn, StaggerChildren } from "@/components/gsap-animations"
import { BookOpen, Users, FolderOpen, TrendingUp, DollarSign } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalProfessors: 0,
    totalCategories: 0,
    totalEnrollments: 0,
  })
  const [courseStats, setCourseStats] = useState<VideoStatistic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [courses, professors, categories] = await Promise.all([
        api.getCourses(0, 1),
        api.getProfessors(),
        api.getCategories(),
      ])

      setStats({
        totalCourses: courses.totalElements || 0,
        totalProfessors: professors.length,
        totalCategories: categories.length,
        totalEnrollments: 12500, // Mock
      })
    } catch (error) {
      console.error("Failed to load stats:", error)
      // Mock data
      setStats({
        totalCourses: 156,
        totalProfessors: 24,
        totalCategories: 12,
        totalEnrollments: 12500,
      })
    } finally {
      setLoading(false)
    }
  }

  const overviewStats = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Professors",
      value: stats.totalProfessors,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Enrollments",
      value: stats.totalEnrollments.toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  // Mock chart data
  const enrollmentData = [
    { month: "Jan", enrollments: 1200 },
    { month: "Feb", enrollments: 1800 },
    { month: "Mar", enrollments: 2200 },
    { month: "Apr", enrollments: 1900 },
    { month: "May", enrollments: 2800 },
    { month: "Jun", enrollments: 3200 },
  ]

  const categoryData = [
    { name: "Web Dev", value: 45 },
    { name: "Data Science", value: 30 },
    { name: "Design", value: 15 },
    { name: "Marketing", value: 10 },
  ]

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 18000 },
    { month: "Mar", revenue: 22000 },
    { month: "Apr", revenue: 19000 },
    { month: "May", revenue: 28000 },
    { month: "Jun", revenue: 32000 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your platform performance and statistics.</p>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </StaggerChildren>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <FadeIn>
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn direction="right">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`$${value}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <FadeIn>
          <Card>
            <CardHeader>
              <CardTitle>Courses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn direction="up" delay={0.2} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New enrollment", course: "Web Development Bootcamp", time: "2 min ago", icon: Users },
                  { action: "Course published", course: "Python Masterclass", time: "15 min ago", icon: BookOpen },
                  { action: "New enrollment", course: "UI/UX Design", time: "1 hour ago", icon: Users },
                  { action: "Revenue received", course: "$299.99", time: "2 hours ago", icon: DollarSign },
                  { action: "New enrollment", course: "Data Science Basics", time: "3 hours ago", icon: Users },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="p-2 rounded-full bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.course}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
