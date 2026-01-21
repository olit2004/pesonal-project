import { useState, useEffect } from "react";
import Sidebar from "../SideBar";
import StatCard from "../StatCard";
import EnrolledCourseCard from "../EnrolledCourseCard";
import { useAuth } from "../../../service/AuthContext";
import { Link } from "react-router-dom";
import { getStudentStats } from "../../../service/student";

const StudentOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStudentStats();
        setStats(data.data);
      } catch (error) {
        console.error("Failed to fetch student stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-main">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full bg-bg-main">
      <Sidebar role="STUDENT" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-base">Welcome back, {user?.firstName}! 👋</h1>
          <p className="text-text-muted">
            {stats?.activeCourses > 0
              ? `You have ${stats.activeCourses} active courses.`
              : "You haven't enrolled in any courses yet."}
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Enrolled" value={stats?.activeCourses || 0} icon="📚" colorClass="text-blue-500 bg-blue-500" />
          <StatCard title="Completed" value={stats?.completedCourses || 0} icon="🏆" colorClass="text-green-500 bg-green-500" />
          <StatCard title="Overall Progress" value={`${stats?.overallCompletion || 0}%`} icon="📈" colorClass="text-purple-500 bg-purple-500" />
        </div>

        {/* Enrolled Courses */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-base">Recent Courses</h2>
            <Link to="/dashboard/my-courses" className="text-brand text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats?.courses?.slice(0, 4).map((enrolled) => (
              <EnrolledCourseCard
                key={enrolled.courseId}
                course={{
                  id: enrolled.courseId,
                  title: enrolled.title,
                  thumbnailUrl: enrolled.thumbnailUrl
                }}
                progress={enrolled.percentage}
              />
            ))}
            {(!stats?.courses || stats.courses.length === 0) && (
              <div className="col-span-full py-12 text-center bg-bg-card border border-dashed border-border-dim rounded-2xl">
                <p className="text-text-muted">No courses found. <Link to="/dashboard/explore" className="text-brand hover:underline">Browse courses</Link></p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentOverview;