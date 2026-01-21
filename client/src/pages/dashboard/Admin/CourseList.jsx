import { useState, useEffect } from "react";
import Sidebar from "../SideBar";
import { Link } from "react-router-dom";
import { Edit, Trash2, Eye, Plus, CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "../../../service/api";

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // For Admins, we might want to see all courses, but let's start with a general list
      // Or we can query by status if needed: api.get("/courses?status=ALL") 
      // Current backend only returns PUBLISHED unless status is specified.
      const { data } = await api.get("/courses");
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/courses/${id}/status`, { status: "PUBLISHED" });
      fetchCourses();
    } catch (error) {
      alert("Failed to approve course: " + (error.response?.data?.message || error.message));
    }
  };

  const handleArchive = async (id) => {
    try {
      await api.patch(`/courses/${id}/status`, { status: "ARCHIVED" });
      fetchCourses();
    } catch (error) {
      alert("Failed to archive course: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this course? This action cannot be undone.")) return;

    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (error) {
      alert("Failed to delete course: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex flex-1 h-full bg-bg-main">
      <Sidebar role="ADMIN" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black">Manage Courses</h1>
            <p className="text-text-muted">Create, edit, and monitor your course catalog.</p>
          </div>
          <Link to="/admin/courses/create" className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand/20 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} /> Create New Course
          </Link>
        </header>

        <div className="bg-bg-card rounded-3xl border border-border-dim overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-brand animate-spin" />
              <p className="text-text-muted font-bold">Loading your catalog...</p>
            </div>
          ) : courses.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-bg-main border-b border-border-dim">
                <tr>
                  <th className="p-4 font-bold text-sm">Course Title</th>
                  <th className="p-4 font-bold text-sm">Price</th>
                  <th className="p-4 font-bold text-sm">Status</th>
                  <th className="p-4 font-bold text-sm">Students</th>
                  <th className="p-4 font-bold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-border-dim hover:bg-bg-main/30 transition">
                    <td className="p-4 font-medium">{course.title}</td>
                    <td className="p-4 font-bold">
                      <span className="text-text-muted font-normal text-xs mr-1">$</span>
                      {course.price}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                        course.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                        {course.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted">{course._count?.enrollments || 0}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {course.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => handleApprove(course.id)}
                            className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition"
                            title="Approve & Publish"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <Link
                          to={`/dashboard/course/${course.id}`}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        {course.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => handleArchive(course.id)}
                            className="p-2 hover:bg-slate-50 text-slate-600 rounded-lg transition"
                            title="Archive"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Hard Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center">
              <p className="text-text-muted mb-4 font-bold text-xl">No courses found in the catalog.</p>
              <Link to="/admin/courses/create" className="text-brand font-black hover:underline">
                Create the first one now!
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCourseList;
