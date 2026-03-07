import { useState, useEffect, useMemo } from "react";
import Sidebar from "../SideBar";
import StatCard from "../StatCard";
import EnrolledCourseCard from "../EnrolledCourseCard";
import { useAuth } from "../../../service/AuthContext";
import { Link } from "react-router-dom";
import { getStudentStats } from "../../../service/student";
import Loading from "../../../components/ui/Loading";
import Avatar from "../../../components/ui/Avatar";
import { useData } from "../../../service/DataContext";
import CourseCard from "../../../components/courses/CourseCard"
import SyllabusModal from "../../../components/SyllabusModal"


const StudentOverview = () => {
  const { user } = useAuth();
  const { stats, fetchStats, catalog, fetchCatalog, loading: dataLoading } = useData();
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchStats();
    fetchCatalog();
  }, [fetchStats, fetchCatalog]);

  const popularCourses = useMemo(() => {
    if (!catalog) return [];
    return [...catalog]
      .sort((a, b) => (b.enrollments?.length || 0) - (a.enrollments?.length || 0))
      .slice(0, 3);
  }, [catalog]);

  const openSyllabus = (course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  // Show a base loader only if we have ABSOLUTELY nothing yet
  const isWholesaleLoading = (!stats && dataLoading.stats) && (!catalog && dataLoading.catalog);

  if (isWholesaleLoading) {
    return (
      <div className="flex flex-1 h-full bg-bg-main">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <Loading text="Preparing your personalized dashboard..." />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full bg-bg-main">
      <Sidebar role="STUDENT" />

      <main className="flex-1 p-8 overflow-y-auto w-full">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-text-base animate-in fade-in slide-in-from-left duration-700">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-text-muted mt-1">
              {stats?.activeCourses > 0
                ? `You have ${stats.activeCourses} active courses.`
                : "Ready to start your learning journey?"}
            </p>
          </div>
          <Avatar user={user} size="lg" />
        </header>

        {/* Stats Grid - Show skeleton-like placeholder if loading and no stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {!stats && dataLoading.stats ? (
            <div className="col-span-full h-24 bg-bg-card/50 animate-pulse rounded-2xl border border-border-dim" />
          ) : (
            <>
              <StatCard title="Enrolled" value={stats?.activeCourses || 0} />
              <StatCard title="Completed" value={stats?.completedCourses || 0} />
              <StatCard title="Overall Progress" value={`${stats?.overallCompletion || 0}%`} />
            </>
          )}
        </div>

        {/* Recently Enrolled Courses */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-base">Recently Enrolled Courses</h2>
            <Link to="/dashboard/my-courses" className="text-brand text-sm font-bold hover:underline">View All</Link>
          </div>

          {!stats && dataLoading.stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/3] bg-bg-card/50 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
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
              {(!stats?.courses || stats.courses.length === 0) && !dataLoading.stats && (
                <div className="col-span-full py-12 text-center bg-bg-card border border-dashed border-border-dim rounded-2xl">
                  <p className="text-text-muted">No courses found. <Link to="/dashboard/explore" className="text-brand hover:underline">Browse courses</Link></p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Popular Courses Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-base">Popular Courses</h2>
            <Link to="/dashboard/explore" className="text-brand text-sm font-bold hover:underline">View All</Link>
          </div>

          {!catalog && dataLoading.catalog ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="aspect-video bg-bg-card/50 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCourses.map((course) => (
                <div key={course.id} className="relative group">
                  <div className="absolute top-4 left-4 z-10 bg-brand text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {course.price === 0 ? "FREE" : `$${course.price}`}
                  </div>
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    desc={course.description}
                    duration="Self-Paced"
                    type="Cloud Learning"
                    img={course.thumbnailUrl || "/Assets/placeholder.jpg"}
                    price={course.price}
                    onSyllabusClick={() => openSyllabus(course)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SyllabusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseTitle={selectedCourse?.title}
      />
    </div>
  );
};

export default StudentOverview;