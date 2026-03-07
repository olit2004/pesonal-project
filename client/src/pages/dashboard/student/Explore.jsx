import { useState, useEffect, useMemo } from "react"
import Sidebar from "../SideBar"
import CourseCard from "../../../components/courses/CourseCard"
import SyllabusModal from "../../../components/SyllabusModal"
import { Search, SlidersHorizontal, BookOpen } from "lucide-react"
import { getExploreCourses } from "../../../service/student"
import Loading from "../../../components/ui/Loading"
import { useData } from "../../../service/DataContext"

const Explore = () => {
  const { catalog, fetchCatalog } = useData();
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(!catalog)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        await fetchCatalog();
      } catch (error) {
        console.error("Failed to fetch catalog:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, [fetchCatalog]);

  const filteredCourses = useMemo(() => {
    const q = query.toLowerCase()
    const courses = catalog || [];
    return courses.filter((course) =>
      course.title.toLowerCase().includes(q)
    )
  }, [query, catalog])

  const openSyllabus = (course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-1 h-full bg-bg-main">
      <Sidebar role="STUDENT" />

      <main className="flex-1 p-8 overflow-y-auto w-full">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-text-base mb-2">
            Explore Catalog
          </h1>
          <p className="text-text-muted font-medium">
            Find your next challenge in our curated list of courses.
          </p>
        </header>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-10">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-bg-card border border-border-dim rounded-2xl
                         focus:ring-2 focus:ring-brand outline-none transition-all shadow-sm
                         text-text-base"
            />
          </div>

          <button
            type="button"
            className="px-6 bg-bg-card border border-border-dim rounded-2xl
                       flex items-center gap-2 font-bold text-text-base
                       hover:border-brand transition-colors"
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>
        </div>

        {/* Course Grid */}
        {loading ? (
          <Loading text="Hunting for challenges..." />
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="relative">
                {/* Price Badge */}
                <div className="absolute top-4 left-4 z-10 bg-brand text-white px-3 py-1
                                rounded-lg text-xs font-bold shadow-lg">
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
        ) : (
          <div className="text-center py-20 bg-bg-card rounded-3xl border border-dashed border-border-dim">
            <div className="bg-brand/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-brand" size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-base mb-2">No courses found</h3>
            <p className="text-text-muted">We couldn't find any courses matching your search.</p>
          </div>
        )}
      </main>

      <SyllabusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseTitle={selectedCourse?.title}
      />
    </div>
  )
}

export default Explore
