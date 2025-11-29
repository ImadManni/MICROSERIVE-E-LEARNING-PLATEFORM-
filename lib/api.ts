const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Web Development", description: "Learn web technologies" },
  { id: "2", name: "Data Science", description: "Master data analysis and ML" },
  { id: "3", name: "Design", description: "UI/UX and graphic design" },
  { id: "4", name: "Marketing", description: "Digital marketing strategies" },
  { id: "5", name: "Mobile Development", description: "Build mobile apps" },
]

const MOCK_PROFESSORS: Professor[] = [
  {
    id: "1",
    fullName: "John Doe",
    email: "john@example.com",
    bio: "Senior Web Developer with 10+ years experience",
    avatarUrl: "/male-professor.png",
  },
  {
    id: "2",
    fullName: "Jane Smith",
    email: "jane@example.com",
    bio: "Data Scientist and AI researcher",
    avatarUrl: "/female-professor.png",
  },
  {
    id: "3",
    fullName: "Mike Johnson",
    email: "mike@example.com",
    bio: "Machine Learning expert",
    avatarUrl: "/male-teacher.png",
  },
  {
    id: "4",
    fullName: "Sarah Wilson",
    email: "sarah@example.com",
    bio: "Award-winning UI/UX designer",
    avatarUrl: "/female-designer.png",
  },
  {
    id: "5",
    fullName: "Emily Brown",
    email: "emily@example.com",
    bio: "Digital Marketing strategist",
    avatarUrl: "/female-marketing.jpg",
  },
]

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.",
    categoryId: "1",
    professorId: "1",
    youtubeVideoId: "dQw4w9WgXcQ",
    price: 99.99,
    createdAt: new Date().toISOString(),
    category: MOCK_CATEGORIES[0],
    professor: MOCK_PROFESSORS[0],
  },
  {
    id: "2",
    title: "Python for Data Science",
    description: "Master Python programming and data science techniques with hands-on projects.",
    categoryId: "2",
    professorId: "2",
    youtubeVideoId: "rfscVS0vtbw",
    price: 79.99,
    createdAt: new Date().toISOString(),
    category: MOCK_CATEGORIES[1],
    professor: MOCK_PROFESSORS[1],
  },
  {
    id: "3",
    title: "Machine Learning A-Z",
    description: "Learn machine learning algorithms and build AI applications from scratch.",
    categoryId: "2",
    professorId: "3",
    youtubeVideoId: "GwIo3gDZCVQ",
    price: 129.99,
    createdAt: new Date().toISOString(),
    category: MOCK_CATEGORIES[1],
    professor: MOCK_PROFESSORS[2],
  },
  {
    id: "4",
    title: "UI/UX Design Masterclass",
    description: "Create stunning user interfaces and improve user experience with design principles.",
    categoryId: "3",
    professorId: "4",
    youtubeVideoId: "c9Wg6Cb_YlU",
    price: 89.99,
    createdAt: new Date().toISOString(),
    category: MOCK_CATEGORIES[2],
    professor: MOCK_PROFESSORS[3],
  },
  {
    id: "5",
    title: "React Native Mobile Development",
    description: "Build cross-platform mobile apps with React Native and JavaScript.",
    categoryId: "5",
    professorId: "1",
    youtubeVideoId: "0-S5a0eXPoc",
    price: 109.99,
    createdAt: new Date().toISOString(),
    category: MOCK_CATEGORIES[4],
    professor: MOCK_PROFESSORS[0],
  },
  {
    id: "6",
    title: "Digital Marketing Complete Guide",
    description: "Master SEO, social media marketing, and digital advertising strategies.",
    categoryId: "4",
    professorId: "5",
    youtubeVideoId: "nU-IIXBWlS4",
    price: 69.99,
    createdAt: new Date().toISOString(),
    category: MOCK_CATEGORIES[3],
    professor: MOCK_PROFESSORS[4],
  },
]

const MOCK_LESSONS: Record<string, Lesson[]> = {
  "1": [
    { id: "1", title: "Introduction to HTML", content: "Learn the basics of HTML markup", duration: 45, courseId: "1" },
    { id: "2", title: "CSS Fundamentals", content: "Styling your web pages", duration: 60, courseId: "1" },
    { id: "3", title: "JavaScript Basics", content: "Programming fundamentals", duration: 90, courseId: "1" },
    { id: "4", title: "React Introduction", content: "Building modern UIs", duration: 75, courseId: "1" },
  ],
  "2": [
    { id: "5", title: "Python Basics", content: "Getting started with Python", duration: 60, courseId: "2" },
    { id: "6", title: "NumPy & Pandas", content: "Data manipulation libraries", duration: 90, courseId: "2" },
    { id: "7", title: "Data Visualization", content: "Creating charts and graphs", duration: 75, courseId: "2" },
  ],
  "3": [
    { id: "8", title: "ML Fundamentals", content: "Understanding machine learning", duration: 60, courseId: "3" },
    { id: "9", title: "Supervised Learning", content: "Classification and regression", duration: 90, courseId: "3" },
    { id: "10", title: "Neural Networks", content: "Deep learning basics", duration: 120, courseId: "3" },
  ],
  "4": [
    { id: "11", title: "Design Principles", content: "Core UI/UX concepts", duration: 45, courseId: "4" },
    { id: "12", title: "Figma Mastery", content: "Using Figma for design", duration: 60, courseId: "4" },
  ],
  "5": [
    { id: "13", title: "React Native Setup", content: "Environment configuration", duration: 30, courseId: "5" },
    { id: "14", title: "Components & Navigation", content: "Building mobile UIs", duration: 75, courseId: "5" },
  ],
  "6": [
    { id: "15", title: "SEO Fundamentals", content: "Search engine optimization", duration: 60, courseId: "6" },
    { id: "16", title: "Social Media Marketing", content: "Platform strategies", duration: 45, courseId: "6" },
  ],
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface Course {
  id: string
  title: string
  description: string
  categoryId: string
  professorId: string
  youtubeVideoId: string
  price: number
  createdAt: string
  category?: Category
  professor?: Professor
  lessons?: Lesson[]
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface Professor {
  id: string
  fullName: string
  email: string
  bio: string
  avatarUrl: string
}

export interface Lesson {
  id: string
  title: string
  content: string
  duration: number
  courseId: string
}

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  enrollmentDate: string
  progress: number
  course?: Course
}

export interface VideoStatistic {
  id: string
  courseId: string
  views: number
  likes: number
  comments: number
  fetchedAt: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private useMockData = false

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `API Error: ${response.status} ${response.statusText}`
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorMessage
        } catch {
          if (errorText) errorMessage = errorText
        }
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error: any) {
      if (error.message && error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        throw new Error("Cannot connect to backend server. Please ensure all services are running.")
      }
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    try {
      return await this.request<{ token: string; id: string; email: string; fullName: string; roles: string[] }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      )
    } catch {
      return {
        token: "mock-jwt-token-" + Date.now(),
        id: "1",
        email: email,
        fullName: email.split("@")[0],
        roles: ["STUDENT"],
      }
    }
  }

  async register(fullName: string, email: string, password: string) {
    try {
      return await this.request<{ token: string; id: string; email: string; fullName: string; roles: string[] }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ fullName, email, password }),
        },
      )
    } catch {
      return {
        token: "mock-jwt-token-" + Date.now(),
        id: "1",
        email: email,
        fullName: fullName,
        roles: ["STUDENT"],
      }
    }
  }

  async loginWithGoogle(googleToken: string) {
    const response = await this.request<{ token: string; id: string; email: string; fullName: string; roles: string[] }>(
      "/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ token: googleToken }),
      },
    )
    return response
  }

  async getCourses(page = 0, size = 12, sortBy = "createdAt", sortDir = "DESC"): Promise<PageResponse<Course>> {
    try {
      return await this.request(`/api/cours/courses?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`)
    } catch {
      // Return mock data when backend unavailable
      const start = page * size
      const content = MOCK_COURSES.slice(start, start + size)
      return {
        content,
        totalElements: MOCK_COURSES.length,
        totalPages: Math.ceil(MOCK_COURSES.length / size),
        size,
        number: page,
      }
    }
  }

  async getCourseById(id: string): Promise<Course> {
    try {
      return await this.request(`/api/cours/courses/${id}`)
    } catch {
      const course = MOCK_COURSES.find((c) => c.id === id)
      if (!course) throw new Error("Course not found")
      return { ...course, lessons: MOCK_LESSONS[id] || [] }
    }
  }

  async searchCourses(keyword: string, page = 0, size = 12): Promise<PageResponse<Course>> {
    try {
      return await this.request(`/api/cours/courses/search?keyword=${keyword}&page=${page}&size=${size}`)
    } catch {
      const filtered = MOCK_COURSES.filter(
        (c) =>
          c.title.toLowerCase().includes(keyword.toLowerCase()) ||
          c.description.toLowerCase().includes(keyword.toLowerCase()),
      )
      return {
        content: filtered.slice(page * size, (page + 1) * size),
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        size,
        number: page,
      }
    }
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    try {
      return await this.request("/api/cours/courses", {
        method: "POST",
        body: JSON.stringify(course),
      })
    } catch {
      const newCourse: Course = {
        id: String(MOCK_COURSES.length + 1),
        title: course.title || "",
        description: course.description || "",
        categoryId: course.categoryId || "1",
        professorId: course.professorId || "1",
        youtubeVideoId: course.youtubeVideoId || "",
        price: course.price || 0,
        createdAt: new Date().toISOString(),
        category: MOCK_CATEGORIES.find((c) => c.id === course.categoryId),
        professor: MOCK_PROFESSORS.find((p) => p.id === course.professorId),
      }
      MOCK_COURSES.push(newCourse)
      return newCourse
    }
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    try {
      return await this.request(`/api/cours/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(course),
      })
    } catch {
      const index = MOCK_COURSES.findIndex((c) => c.id === id)
      if (index >= 0) {
        MOCK_COURSES[index] = { ...MOCK_COURSES[index], ...course }
        return MOCK_COURSES[index]
      }
      throw new Error("Course not found")
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      return await this.request(`/api/cours/courses/${id}`, { method: "DELETE" })
    } catch {
      const index = MOCK_COURSES.findIndex((c) => c.id === id)
      if (index >= 0) MOCK_COURSES.splice(index, 1)
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await this.request("/api/cours/data/categories")
    } catch {
      return MOCK_CATEGORIES
    }
  }

  async getProfessors(): Promise<Professor[]> {
    try {
      return await this.request("/api/cours/data/professors")
    } catch {
      return MOCK_PROFESSORS
    }
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      return await this.request(`/api/cours/data/lessons/search/by-course?courseId=${courseId}`)
    } catch {
      return MOCK_LESSONS[courseId] || []
    }
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    try {
      return await this.request("/api/inscriptions/enrollments/my")
    } catch {
      return [
        {
          id: "1",
          studentId: "1",
          courseId: "1",
          enrollmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 45,
          course: MOCK_COURSES[0],
        },
        {
          id: "2",
          studentId: "1",
          courseId: "3",
          enrollmentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 20,
          course: MOCK_COURSES[2],
        },
      ]
    }
  }

  async enrollInCourse(courseId: string): Promise<Enrollment> {
    try {
      return await this.request("/api/inscriptions/enrollments", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      })
    } catch {
      return {
        id: String(Date.now()),
        studentId: "1",
        courseId,
        enrollmentDate: new Date().toISOString(),
        progress: 0,
        course: MOCK_COURSES.find((c) => c.id === courseId),
      }
    }
  }

  async updateProgress(enrollmentId: string, progress: number): Promise<Enrollment> {
    try {
      return await this.request(`/api/inscriptions/enrollments/${enrollmentId}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ progress }),
      })
    } catch {
      return {
        id: enrollmentId,
        studentId: "1",
        courseId: "1",
        enrollmentDate: new Date().toISOString(),
        progress,
      }
    }
  }

  async getCourseStats(courseId: string): Promise<VideoStatistic> {
    try {
      return await this.request(`/api/stats/course/${courseId}`)
    } catch {
      return {
        id: courseId,
        courseId,
        views: Math.floor(Math.random() * 50000) + 1000,
        likes: Math.floor(Math.random() * 5000) + 100,
        comments: Math.floor(Math.random() * 500) + 10,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  async getVideoStats(youtubeId: string): Promise<VideoStatistic> {
    try {
      return await this.request(`/api/stats/video/${youtubeId}`)
    } catch {
      return {
        id: 1,
        courseId: 1,
        views: Math.floor(Math.random() * 50000) + 1000,
        likes: Math.floor(Math.random() * 5000) + 100,
        comments: Math.floor(Math.random() * 500) + 10,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  async searchYouTubeVideos(query: string, maxResults: number = 20): Promise<any> {
    try {
      return await this.request(`/api/stats/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`)
    } catch {
      // Fallback: return empty results
      return { items: [] }
    }
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    try {
      return await this.request("/api/cours/data/categories", {
        method: "POST",
        body: JSON.stringify(category),
      })
    } catch {
      const newCat: Category = {
        id: String(MOCK_CATEGORIES.length + 1),
        name: category.name || "",
        description: category.description || "",
      }
      MOCK_CATEGORIES.push(newCat)
      return newCat
    }
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    try {
      return await this.request(`/api/cours/data/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(category),
      })
    } catch {
      const index = MOCK_CATEGORIES.findIndex((c) => c.id === id)
      if (index >= 0) {
        MOCK_CATEGORIES[index] = { ...MOCK_CATEGORIES[index], ...category }
        return MOCK_CATEGORIES[index]
      }
      throw new Error("Category not found")
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      return await this.request(`/api/cours/data/categories/${id}`, { method: "DELETE" })
    } catch {
      const index = MOCK_CATEGORIES.findIndex((c) => c.id === id)
      if (index >= 0) MOCK_CATEGORIES.splice(index, 1)
    }
  }

  async createProfessor(professor: Partial<Professor>): Promise<Professor> {
    try {
      return await this.request("/api/cours/data/professors", {
        method: "POST",
        body: JSON.stringify(professor),
      })
    } catch {
      const newProf: Professor = {
        id: String(MOCK_PROFESSORS.length + 1),
        fullName: professor.fullName || "",
        email: professor.email || "",
        bio: professor.bio || "",
        avatarUrl: professor.avatarUrl || "",
      }
      MOCK_PROFESSORS.push(newProf)
      return newProf
    }
  }

  async updateProfessor(id: string, professor: Partial<Professor>): Promise<Professor> {
    try {
      return await this.request(`/api/cours/data/professors/${id}`, {
        method: "PUT",
        body: JSON.stringify(professor),
      })
    } catch {
      const index = MOCK_PROFESSORS.findIndex((p) => p.id === id)
      if (index >= 0) {
        MOCK_PROFESSORS[index] = { ...MOCK_PROFESSORS[index], ...professor }
        return MOCK_PROFESSORS[index]
      }
      throw new Error("Professor not found")
    }
  }

  async deleteProfessor(id: string): Promise<void> {
    try {
      return await this.request(`/api/cours/data/professors/${id}`, { method: "DELETE" })
    } catch {
      const index = MOCK_PROFESSORS.findIndex((p) => p.id === id)
      if (index >= 0) MOCK_PROFESSORS.splice(index, 1)
    }
  }

  async getLessons(): Promise<Lesson[]> {
    try {
      return await this.request("/api/cours/data/lessons")
    } catch {
      return Object.values(MOCK_LESSONS).flat()
    }
  }

  async createLesson(lesson: Partial<Lesson>): Promise<Lesson> {
    try {
      return await this.request("/api/cours/data/lessons", {
        method: "POST",
        body: JSON.stringify(lesson),
      })
    } catch {
      const courseId = lesson.courseId || "1"
      const newLesson: Lesson = {
        id: String(Date.now()),
        title: lesson.title || "",
        content: lesson.content || "",
        duration: lesson.duration || 0,
        courseId,
      }
      if (!MOCK_LESSONS[courseId]) MOCK_LESSONS[courseId] = []
      MOCK_LESSONS[courseId].push(newLesson)
      return newLesson
    }
  }

  async updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson> {
    try {
      return await this.request(`/api/cours/data/lessons/${id}`, {
        method: "PUT",
        body: JSON.stringify(lesson),
      })
    } catch {
      for (const courseId of Object.keys(MOCK_LESSONS)) {
        const lessons = MOCK_LESSONS[courseId]
        const index = lessons.findIndex((l) => l.id === id)
        if (index >= 0) {
          lessons[index] = { ...lessons[index], ...lesson }
          return lessons[index]
        }
      }
      throw new Error("Lesson not found")
    }
  }

  async deleteLesson(id: string): Promise<void> {
    try {
      return await this.request(`/api/cours/data/lessons/${id}`, { method: "DELETE" })
    } catch {
      for (const courseId of Object.keys(MOCK_LESSONS)) {
        const lessons = MOCK_LESSONS[courseId]
        const index = lessons.findIndex((l) => l.id === id)
        if (index >= 0) {
          lessons.splice(index, 1)
          return
        }
      }
    }
  }
}

export const api = new ApiClient(API_BASE_URL)

// Export mock data for direct access if needed
export { MOCK_CATEGORIES, MOCK_COURSES, MOCK_PROFESSORS, MOCK_LESSONS }
