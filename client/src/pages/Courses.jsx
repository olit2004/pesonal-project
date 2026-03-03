import { useState, useEffect } from "react";
import CourseCard from "../components/courses/CourseCard";
import SyllabusModal from "../components/SyllabusModal";
import { getExploreCourses } from "../service/student";

const Courses = () => { 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getExploreCourses();
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const openSyllabus = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100]">
        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold mb-4">Courses We Provide</h2>
        <p className="text-text-muted">Explore our curated list of high-performance engineering courses designed for the next generation of builders.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            desc={course.description}
            img={course.thumbnailUrl || "/Assets/placeholder.jpg"}
            price={course.price}
            duration="Self-Paced"
            onSyllabusClick={() => openSyllabus(course)}
          />
        ))}
        {courses.length === 0 && (
          <div className="col-span-full text-center py-20 bg-bg-card rounded-3xl border border-dashed border-border-dim">
            <p className="text-text-muted font-bold text-lg">No courses available yet. Check back soon!</p>
          </div>
        )}
      </div>

      <SyllabusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseTitle={selectedCourse?.title}
      />
    </section>
  );
};

export default Courses;
