import { useAuth } from "../../service/AuthContext"
import { Link, useLocation } from "react-router-dom"
import { useDarkMode } from "../../hooks/useDarkMode";
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom"


const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useDarkMode();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-[70px] bg-bg-card border-b border-border-dim px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link to={isAdmin ? "/admin" : "/dashboard"} className="text-xl font-bold flex items-center gap-2">
        <img src="/Assets/ignite logo.svg" alt="logo" className="w-6" />
        <span className="hidden sm:inline">Ignite <span className="text-brand">Academy</span></span>
      </Link>

      <div className="flex items-center gap-4">
        <span className="text-sm font-bold bg-brand/5 text-brand px-3 py-1 rounded-full border border-brand/10">
          {isAdmin ? "Admin Console" : "Student Workspace"}
        </span>

        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg bg-bg-main border border-border-dim hover:border-brand transition-colors text-xl"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <div className="h-8 w-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs">
          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
        </div>

        <button onClick={handleLogout} className="text-sm text-red-500 font-bold hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader