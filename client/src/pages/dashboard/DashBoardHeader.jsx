import { useAuth } from "../../service/AuthContext"
import { Link, useLocation } from "react-router-dom"
import { useDarkMode } from "../../hooks/useDarkMode";
import { Sun, Moon, LogOut } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
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
    <header className="h-17.5 bg-bg-card border-b border-border-dim px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link to={isAdmin ? "/admin" : "/dashboard"} className="text-xl font-bold flex items-center gap-2">
        <img src="/Assets/ignite logo.svg" alt="logo" className="w-6" />
        <span className="hidden sm:inline">Ignite <span className="text-brand">Academy</span></span>
      </Link>

      <div className="flex items-center gap-4">


        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg bg-bg-main border border-border-dim hover:border-brand transition-colors text-xl"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <Avatar user={user} />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-xl hover:bg-red-500 hover:text-white transition-all group"
        >
          <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader