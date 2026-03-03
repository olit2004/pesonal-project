import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../service/AuthContext"
import api from "../../service/api"
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { user, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const target = user.role === "ADMIN" ? "/admin" : "/dashboard"
      navigate(target)
    }
  }, [user, navigate])

  
  const handleSubmit = async (e) => {
    e.preventDefault() 

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      })

      login(data.user)
      const target = data.user.role === "ADMIN" ? "/admin" : "/dashboard"
      navigate(target)
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Invalid credentials")
      } else {
        console.error("Login error:", error)
        alert("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-bg-card border border-border-dim p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Email</label>
            <input
              type="email"
              className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-sm">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-brand hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-hover transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-brand font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
