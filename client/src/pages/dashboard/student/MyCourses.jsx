import { useState, useEffect } from "react";
import { useAuth } from "../../../service/AuthContext";
import Sidebar from "../SideBar";
import EnrolledCourseCard from "../EnrolledCourseCard";
import SyllabusModal from "../../../components/SyllabusModal";
import { Search, BookOpen } from "lucide-react";
import { getStudentStats } from "../../../service/student";
import Loading from "../../../components/ui/Loading";
import { Link } from "react-router-dom";

import { useData } from "../../../service/DataContext";

const MyCourses = () => {
  const { user } = useAuth();
  const { stats, fetchStats } = useData();
  const [loading, setLoading] = useState(!stats);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        await fetchStats();
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [fetchStats]);

  const enrolledCourses = stats?.courses || [];

  const openSyllabus = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-1 h-full bg-bg-main">
      <Sidebar role="STUDENT" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-text-base">My Learning</h1>
            <p className="text-text-muted">Continue where you left off</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search your courses..."
              className="w-full pl-10 pr-4 py-2 bg-bg-card border border-border-dim rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <Loading text="Loading your classroom..." />
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <EnrolledCourseCard
                key={course.courseId}
                course={{
                  id: course.courseId,
                  title: course.title,
                  thumbnailUrl: course.thumbnailUrl
                }}
                progress={course.percentage}
                onSyllabusClick={() => openSyllabus(course)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-bg-card rounded-3xl border border-dashed border-border-dim">
            <div className="bg-brand/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-brand" size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-base mb-2">
              {searchTerm ? "No courses found" : "No courses enrolled"}
            </h3>
            <p className="text-text-muted mb-6">
              {searchTerm
                ? "You haven't enrolled in any courses matching your search."
                : "You haven't enrolled in any courses yet. Start your learning journey today!"}
            </p>
            <Link to="/dashboard/explore" className="bg-brand text-white px-6 py-2 rounded-lg font-bold inline-block">
              Browse Catalog
            </Link>
          </div>
        )}
      </main>

      <SyllabusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseTitle={selectedCourse?.title}
      />
    </div>
  );
};

export default MyCourses;
