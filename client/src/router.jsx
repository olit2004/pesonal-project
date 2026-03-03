import { createBrowserRouter } from "react-router-dom"
import App from "./App"

// Public pages
import Home from "./pages/Home"
import Courses from "./pages/Courses"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/auth/login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"

// Auth
import ProtectedRoute from "./pages/auth/ProtectedRoute"

// Student Dashboard
import StudentOverview from "./pages/dashboard/student/Overview"
import MyCourses from "./pages/dashboard/student/MyCourses"
import Explore from "./pages/dashboard/student/Explore"
import CourseDetail from "./pages/dashboard/student/CourseDetail"
import CoursePlayer from "./pages/dashboard/student/CoursePlayer"

// Admin Pages
import AdminOverview from "./pages/dashboard/Admin/Overview"
import AdminCourseList from "./pages/dashboard/Admin/CourseList"
import CourseBuilder from "./pages/dashboard/Admin/CourseBuilder"
import UserManagement from "./pages/dashboard/Admin/UserManagement"
import Sales from "./pages/dashboard/Admin/Sales"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: "courses", element: <Courses /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "course/:courseId", element: <CourseDetail /> },

      // STUDENT 
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]} />
        ),
        children: [
          {
            index: true,
            element: <StudentOverview />,
          },
          {
            path: "my-courses",
            element: <MyCourses />,
          },
          {
            path: "explore",
            element: <Explore />,
          },
          {
            path: "course/:courseId",
            element: <CourseDetail />,
          },
          {
            path: "learn/:courseId",
            element: <CoursePlayer />,
          },
          {
            path: "settings",
            element: (
              <div className="p-8 text-text-base">
                Settings Page (Coming Soon)
              </div>
            ),
          },
        ],
      },

   
      // ADMIN DASHBOARD
      
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]} />
        ),
        children: [
          {
            index: true, // /admin
            element: <AdminOverview />,
          },
          {
            path: "courses", // /admin/courses
            element: <AdminCourseList />,
          },
          {
            path: "courses/create", // /admin/courses/create
            element: <CourseBuilder />,
          },
          {
            path: "users", // /admin/users
            element: <UserManagement />,
          },
          {
            path: "sales", // /admin/sales
            element: <Sales />,
          },
        ],
      },
    ],
  },
])
