import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  CreditCard,
  Compass,
  Users,
  DollarSign,
} from "lucide-react"

const Sidebar = ({ role = "STUDENT" }) => {
  const location = useLocation()

  const adminLinks = [
    {
      name: "Overview",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Manage Courses",
      path: "/admin/courses",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Sales & Finance",
      path: "/admin/sales",
      icon: <DollarSign size={20} />,
    },
  ]

  const studentLinks = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "My Courses",
      path: "/dashboard/my-courses",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Explore",
      path: "/dashboard/explore",
      icon: <Compass size={20} />,
    },

  ]

  const links = role === "ADMIN" ? adminLinks : studentLinks

  return (
    <aside className="w-64 bg-bg-card border-r border-border-dim shrink-0 hidden md:block">
      <div className="p-6 space-y-2 sticky top-[70px]">
        {links.map((link) => {
          const isActive = location.pathname === link.path

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl
                          font-bold transition-all duration-300
                          ${isActive
                  ? "bg-brand text-white shadow-lg shadow-brand/20 translate-x-1"
                  : "text-text-muted hover:bg-brand/5 hover:text-brand hover:translate-x-1"
                }`}
            >
              {link.icon}
              {link.name}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
