import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../service/AuthContext"
import api from "../../service/api"
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    setLoading(true)
    setError("")

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
        setError("Invalid email or password. Please try again.")
      } else {
        console.error("Login error:", error)
        setError("Something went wrong. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-bg-card border border-border-dim p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}

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
            disabled={loading}
            className="w-full py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-hover transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {loading ? "Signing In..." : "Sign In"}
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
