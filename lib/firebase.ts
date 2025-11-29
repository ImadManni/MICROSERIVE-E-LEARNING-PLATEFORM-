import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, User, onAuthStateChanged } from "firebase/auth"
import { getFirestore, Firestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAm8JxN4_mSab5X6wX6v3M8CPKBSRhDib0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "microservice-e-learning.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "microservice-e-learning",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "microservice-e-learning.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "4531274204",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:4531274204:web:16c1246278313813754f19",
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let firestore: Firestore | undefined

// Initialize Firebase only in browser
if (typeof window !== "undefined") {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
      console.log("✅ Firebase app initialized")
    } else {
      app = getApps()[0]
    }
    
    auth = getAuth(app)
    firestore = getFirestore(app)
    
    console.log("✅ Firebase Auth and Firestore initialized")
  } catch (error) {
    console.error("❌ Firebase initialization error:", error)
  }
}

export const getFirebaseAuth = (): Auth => {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be used in browser")
  }
  if (!auth) {
    throw new Error("Firebase Auth not initialized. Make sure Firebase is properly configured.")
  }
  return auth
}

export const getFirebaseFirestore = (): Firestore => {
  if (typeof window === "undefined") {
    throw new Error("Firestore can only be used in browser")
  }
  if (!firestore) {
    throw new Error("Firestore not initialized. Make sure Firebase is properly configured.")
  }
  return firestore
}

export interface StudentData {
  id: string
  email: string
  fullName: string
  roles: string[]
  createdAt: any
}

export const signInWithGoogle = async (): Promise<User> => {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export const saveStudentToFirestore = async (user: User): Promise<StudentData> => {
  const db = getFirebaseFirestore()
  const studentRef = doc(db, "students", user.uid)
  
  try {
    const studentDoc = await getDoc(studentRef)
    
    // Admin emails - users with these emails get ADMIN role
    const adminEmails = [
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
      // Add your email here for admin access:
      // "your-email@gmail.com",
    ].filter(Boolean)

    const userEmail = user.email || ""
    const isAdminEmail = adminEmails.includes(userEmail)
    
    // Determine roles - admin emails get ADMIN role, others get STUDENT
    const userRoles = isAdminEmail ? ["ROLE_STUDENT", "ADMIN"] : ["ROLE_STUDENT"]
    
    const studentData: StudentData = {
      id: user.uid,
      email: userEmail,
      fullName: user.displayName || userEmail.split("@")[0] || "User",
      roles: userRoles,
      createdAt: serverTimestamp(),
    }
    
    // Prepare data without serverTimestamp for the object
    const dataToSave = {
      id: user.uid,
      email: userEmail,
      fullName: user.displayName || userEmail.split("@")[0] || "User",
      roles: userRoles,
      createdAt: serverTimestamp(),
    }
    
    if (!studentDoc.exists()) {
      await setDoc(studentRef, dataToSave)
      console.log("✅ New student saved to Firestore:", studentData)
    } else {
      // Update existing document, preserve createdAt but update roles if admin
      const existingData = studentDoc.data()
      const userEmail = user.email || ""
      const adminEmails = [
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
      ].filter(Boolean)
      const isAdminEmail = adminEmails.includes(userEmail)
      const userRoles = isAdminEmail ? ["ROLE_STUDENT", "ADMIN"] : (existingData?.roles || ["ROLE_STUDENT"])
      
      await setDoc(studentRef, {
        id: user.uid,
        email: userEmail,
        fullName: user.displayName || userEmail.split("@")[0] || "User",
        roles: userRoles,
        createdAt: existingData?.createdAt || serverTimestamp(),
      }, { merge: true })
      console.log("✅ Student updated in Firestore:", studentData)
    }
    
    return studentData
  } catch (error: any) {
    console.error("❌ Error saving student to Firestore:", error)
    if (error.code === 'permission-denied') {
      throw new Error("Permission denied. Please check Firestore security rules. Make sure you're authenticated and the rules allow write access.")
    }
    throw error
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined" || !auth) return null
  return auth.currentUser
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (typeof window === "undefined" || !auth) return () => {}
  return onAuthStateChanged(auth, callback)
}

export { auth, firestore, app }

