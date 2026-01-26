import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuth } from "../../service/AuthContext";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();




  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-bg-card shadow-sm border-b border-border-dim transition-colors duration-300">
      <div className="container mx-auto px-6 h-17.5 flex items-center justify-between">

        {/* Logo Section */}
        <Link to="/" className="text-2xl font-extrabold flex items-center gap-2 group">
          <img src="/Assets/ignite logo.svg" alt="logo" className="w-8 group-hover:rotate-12 transition-transform" />
          <span className="text-text-base">
            Ignite <span className="text-brand">Academy</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="flex items-center gap-8">
          <ul className="hidden md:flex gap-8">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`font-medium transition-colors relative pb-1 ${location.pathname === link.path
                    ? "text-brand after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand"
                    : "text-text-base hover:text-brand"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 border-l border-border-dim pl-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-bg-main border border-border-dim hover:border-brand transition-colors text-xl"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* Auth UI  */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-lg font-bold text-brand bg-brand/10 hover:bg-brand hover:text-white border border-brand/20 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-brand text-white px-5 py-2 rounded-lg font-bold hover:bg-brand-hover shadow-md shadow-brand/20 transition-all duration-300 active:scale-95"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden text-3xl text-text-base"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      {isOpen && (
        <div className="absolute top-17.5 left-0 w-full bg-bg-card border-b border-border-dim p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-bold uppercase tracking-wide ${location.pathname === link.path ? "text-brand" : "text-text-base"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-border-dim flex flex-col gap-3">
            {user ? (
              <>
                <div className="mb-2">
                  <p className="text-text-muted text-sm">Signed in as</p>
                  <p className="font-bold text-lg">{user.firstName} {user.lastName}</p>
                </div>
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-bg-main text-center font-bold rounded-xl border border-border-dim"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-brand text-center font-bold rounded-xl border border-brand/20"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-brand text-white text-center font-bold rounded-xl shadow-lg shadow-brand/20"
                 >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;