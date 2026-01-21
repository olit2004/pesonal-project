import { createContext, useContext, useEffect, useState } from "react"
import api from "./api"

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => { },
  logout: () => { },
  enrollCourse: () => { }
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on refresh
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("[AuthContext] Attempting to restore session...");
        const response = await api.get("/users/me")
        // Check for both structures: { user } or { data } or { success, data }
        const loadedUser = response.data.user || response.data.data || response.data;

        if (loadedUser && (loadedUser.id || loadedUser.email)) {
          console.log("[AuthContext] Session restored for:", loadedUser.email);
          setUser(loadedUser)
        } else {
          console.warn("[AuthContext] Session restoration returned no user data");
          setUser(null)
        }
      } catch (err) {
        if (err.response?.status === 401) {
          console.log("[AuthContext] No active session found (401)");
        } else {
          console.error("[AuthContext] Load user error:", err);
        }
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // ✅ LOGIN FUNCTION (missing piece)
  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout")
    } finally {
      setUser(null)
    }
  }

  const enrollCourse = (course) => {
    if (!user) return

    const newEnrollment = {
      id: `enrol-${Date.now()}`,
      amountPaid: course.price,
      progress: 0,
      course: {
        id: course.id,
        title: course.title,
        thumbnailUrl: course.img || course.thumbnailUrl,
        instructor: course.instructor
      }
    }

    setUser(prev => ({
      ...prev,
      enrollments: [...(prev.enrollments || []), newEnrollment]
    }))
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, enrollCourse }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  return ctx
}
