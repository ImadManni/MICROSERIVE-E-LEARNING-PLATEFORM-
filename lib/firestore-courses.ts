import { getFirebaseFirestore } from "./firebase"
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore"
import type { Course } from "./api"

export interface FirestoreCourse {
  id: string
  title: string
  description: string
  categoryId: string | number
  professorId: string | number
  youtubeVideoId: string
  price: number
  createdAt: Timestamp | Date | string
  updatedAt?: Timestamp | Date | string
  category?: { id: string | number; name: string; description?: string }
  professor?: { id: string | number; fullName: string; email?: string; bio?: string; avatarUrl?: string }
}

// Convert Firestore course to Course type
const firestoreToCourse = (data: any, id: string): Course => {
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
  
  // Handle categoryId and professorId - keep as string if Course type expects string
  const categoryId = data.categoryId?.toString() || "0"
  const professorId = data.professorId?.toString() || "0"
  
  return {
    id: id,
    title: data.title || "",
    description: data.description || "",
    categoryId: categoryId,
    professorId: professorId,
    youtubeVideoId: data.youtubeVideoId || "",
    price: data.price || 0,
    createdAt: createdAt,
    category: data.category,
    professor: data.professor,
  }
}

// Get all courses from Firestore
export const getCoursesFromFirestore = async (): Promise<Course[]> => {
  try {
    const db = getFirebaseFirestore()
    const coursesRef = collection(db, "courses")
    const q = query(coursesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    
    const courses: Course[] = []
    querySnapshot.forEach((doc) => {
      courses.push(firestoreToCourse(doc.data(), doc.id))
    })
    
    console.log(`✅ Loaded ${courses.length} courses from Firestore`)
    return courses
  } catch (error) {
    console.error("❌ Error loading courses from Firestore:", error)
    throw error
  }
}

// Get a single course by ID
export const getCourseFromFirestore = async (id: string): Promise<Course | null> => {
  try {
    const db = getFirebaseFirestore()
    const courseRef = doc(db, "courses", id)
    const courseDoc = await getDoc(courseRef)
    
    if (courseDoc.exists()) {
      return firestoreToCourse(courseDoc.data(), courseDoc.id)
    }
    
    return null
  } catch (error) {
    console.error("❌ Error loading course from Firestore:", error)
    throw error
  }
}

// Save course to Firestore (create or update)
export const saveCourseToFirestore = async (courseData: Partial<Course>, courseId?: string): Promise<Course> => {
  try {
    const db = getFirebaseFirestore()
    
    // If courseId provided, update existing; otherwise create new
    const courseRef = courseId ? doc(db, "courses", courseId) : doc(collection(db, "courses"))
    const courseIdToUse = courseId || courseRef.id
    
    // Check if course exists
    const existingDoc = await getDoc(courseRef)
    const existingData = existingDoc.exists() ? existingDoc.data() : null
    
    const dataToSave: any = {
      title: courseData.title || "",
      description: courseData.description || "",
      categoryId: courseData.categoryId?.toString() || "0",
      professorId: courseData.professorId?.toString() || "0",
      youtubeVideoId: courseData.youtubeVideoId || "",
      price: courseData.price || 0,
      updatedAt: serverTimestamp(),
    }
    
    // Preserve createdAt if updating
    if (existingData) {
      dataToSave.createdAt = existingData.createdAt || serverTimestamp()
    } else {
      dataToSave.createdAt = serverTimestamp()
    }
    
    // Include category and professor if provided
    if (courseData.category) {
      dataToSave.category = courseData.category
    }
    if (courseData.professor) {
      dataToSave.professor = courseData.professor
    }
    
    await setDoc(courseRef, dataToSave)
    
    console.log(`✅ Course ${existingData ? "updated" : "created"} in Firestore:`, courseIdToUse)
    
    // Return the saved course
    const savedDoc = await getDoc(courseRef)
    return firestoreToCourse(savedDoc.data(), courseIdToUse)
  } catch (error: any) {
    console.error("❌ Error saving course to Firestore:", error)
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check Firestore security rules.")
    }
    throw error
  }
}

// Delete course from Firestore
export const deleteCourseFromFirestore = async (courseId: string): Promise<void> => {
  try {
    const db = getFirebaseFirestore()
    const courseRef = doc(db, "courses", courseId)
    await deleteDoc(courseRef)
    console.log(`✅ Course deleted from Firestore:`, courseId)
  } catch (error: any) {
    console.error("❌ Error deleting course from Firestore:", error)
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check Firestore security rules.")
    }
    throw error
  }
}

