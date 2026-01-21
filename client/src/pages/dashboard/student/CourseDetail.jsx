import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../service/AuthContext";
import Sidebar from "../SideBar";
import {
    ChevronLeft,
    Clock,
    BookOpen,
    Star,
    ShieldCheck,
    CheckCircle2,
    PlayCircle,
    Lock,
    ExternalLink
} from "lucide-react";
import api from "../../../service/api";
import { createCheckoutSession, updateLessonProgress } from "../../../service/student";

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { enrollCourse, user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activeLesson, setActiveLesson] = useState(null);
    const [togglingProgress, setTogglingProgress] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${courseId}`);
                const courseData = data.data;
                setCourse(courseData);

                // AUTO-SELECT FIRST LESSON:
                // Find the first module that has lessons
                const firstModuleWithLessons = courseData.modules?.find(m => m.lessons?.length > 0);
                if (firstModuleWithLessons) {
                    // Default to first free lesson or just the first lesson
                    const initialLesson = firstModuleWithLessons.lessons.find(l => l.isFree) || firstModuleWithLessons.lessons[0];
                    setActiveLesson(initialLesson);
                }
            } catch (error) {
                console.error("Fetch course error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const isAlreadyEnrolled = user?.enrollments?.some(e => e.courseId === course?.id);
    const isAdmin = user?.role === "ADMIN";

    const canAccessLesson = (lesson) => lesson.isFree || isAlreadyEnrolled || isAdmin;

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleToggleProgress = async (lessonId, currentStatus) => {
        if (!isAlreadyEnrolled && !isAdmin) return;
        setTogglingProgress(true);
        try {
            await updateLessonProgress(courseId, lessonId, !currentStatus);

            // Update local state
            setCourse(prev => ({
                ...prev,
                modules: prev.modules.map(m => ({
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? { ...l, isCompleted: !currentStatus } : l
                    )
                }))
            }));

            // Update active lesson if it's the one we toggled
            if (activeLesson?.id === lessonId) {
                setActiveLesson(prev => ({ ...prev, isCompleted: !currentStatus }));
            }
        } catch (error) {
            console.error("Failed to toggle progress:", error);
        } finally {
            setTogglingProgress(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            // Redirect to login if not authenticated
            navigate("/login", { state: { from: `/course/${courseId}` } });
            return;
        }

        setIsProcessing(true);
        try {
            if (course.price === 0) {
                await enrollCourse(course);
                setIsSuccess(true);
                setTimeout(() => navigate("/dashboard/my-courses"), 2000);
            } else {
                const { url } = await createCheckoutSession(course.id);
                if (!url) throw new Error("Checkout session failed");
                window.location.href = url;
            }
        } catch (error) {
            console.error("Enrollment error:", error);
            alert(error.message || "Enrollment failed");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-bg-main">
            <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
        </div>
    );

    if (!course) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main p-8">
            <h2 className="text-2xl font-bold mb-4 text-text-base">Course not found</h2>
            <button onClick={() => navigate(-1)} className="text-brand font-bold underline">Go Back</button>
        </div>
    );

    return (
        <div className="flex flex-1 h-full bg-bg-main overflow-hidden">
            <Sidebar role={user?.role || "STUDENT"} />

            <main className="flex-1 p-8 overflow-y-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-brand transition-colors mb-6 font-medium"
                >
                    <ChevronLeft size={20} /> Back to Browse
                </button>

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* LEFT COLUMN: PLAYER & INFO */}
                        <div className="lg:col-span-2">

                            {/* DYNAMIC MEDIA PLAYER */}
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-border-dim mb-8">
                                {(() => {
                                    const videoId = activeLesson ? getYoutubeId(activeLesson.videoUrl) : null;
                                    const isAccessible = activeLesson && canAccessLesson(activeLesson);

                                    if (isAccessible && videoId) {
                                        return (
                                            <iframe
                                                className="w-full h-full"
                                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
                                                title={activeLesson.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        );
                                    }

                                    return (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={course.thumbnailUrl || "/Assets/placeholder.jpg"}
                                                alt={course.title}
                                                className="w-full h-full object-cover opacity-60"
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-6 text-center">
                                                {!isAccessible ? (
                                                    <>
                                                        <Lock size={48} className="mb-4 text-brand" />
                                                        <h3 className="text-xl font-bold">Content Locked</h3>
                                                        <p className="text-sm opacity-90">Enroll in this course to access this lesson.</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <PlayCircle size={48} className="mb-4 text-brand opacity-50" />
                                                        <h3 className="text-xl font-bold">No Video Available</h3>
                                                        <p className="text-sm opacity-90">This lesson does not have a valid video link.</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${course.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {course.status}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-sm font-bold">4.9</span>
                                </div>
                                <span className="text-text-muted text-sm font-medium">{course.enrollments?.length || 0} students</span>
                            </div>

                            <h1 className="text-4xl font-extrabold text-text-base mb-4 leading-tight">{course.title}</h1>

                            {activeLesson && (
                                <div className="mb-6 p-4 bg-brand/5 border-l-4 border-brand rounded-r-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-brand mb-1">Currently Viewing:</p>
                                        <h2 className="text-xl font-bold text-text-base">{activeLesson.title}</h2>
                                    </div>
                                    {(isAlreadyEnrolled || isAdmin) && (
                                        <button
                                            disabled={togglingProgress}
                                            onClick={() => handleToggleProgress(activeLesson.id, activeLesson.isCompleted)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all
                                                ${activeLesson.isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : "bg-bg-main border border-border-dim text-text-base hover:border-brand"}
                                            `}
                                        >
                                            <CheckCircle2 size={18} />
                                            {activeLesson.isCompleted ? "Completed" : "Mark as Complete"}
                                        </button>
                                    )}
                                </div>
                            )}

                            <p className="text-lg text-text-muted mb-8 leading-relaxed">{course.description}</p>

                            {/* CURRICULUM SECTION */}
                            <div className="bg-bg-card border border-border-dim rounded-3xl p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-text-base mb-6 flex items-center gap-2">
                                    <BookOpen size={22} className="text-brand" /> Curriculum
                                </h3>
                                <div className="space-y-4">
                                    {course.modules?.map((module) => (
                                        <div key={module.id} className="border border-border-dim rounded-2xl overflow-hidden bg-bg-main/30">
                                            <div className="bg-bg-main/60 p-4 font-bold flex justify-between items-center border-b border-border-dim">
                                                <span>{module.title}</span>
                                                <span className="text-xs text-text-muted bg-bg-card px-2 py-1 rounded-lg">{module.lessons?.length} Lessons</span>
                                            </div>
                                            <div className="divide-y divide-border-dim/50">
                                                {module.lessons?.map((lesson) => {
                                                    const accessible = canAccessLesson(lesson);
                                                    const isActive = activeLesson?.id === lesson.id;
                                                    return (
                                                        <button
                                                            key={lesson.id}
                                                            disabled={!accessible}
                                                            onClick={() => {
                                                                setActiveLesson(lesson);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            className={`w-full text-left p-4 flex items-center justify-between transition-all group
                                                                ${accessible ? "hover:bg-brand/5 cursor-pointer" : "cursor-not-allowed opacity-50 bg-bg-main/10"}
                                                                ${isActive ? "bg-brand/10 border-l-4 border-brand" : "border-l-4 border-transparent"}
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {accessible ? (
                                                                    <PlayCircle size={20} className={isActive ? "text-brand" : "text-text-muted group-hover:text-brand"} />
                                                                ) : (
                                                                    <Lock size={20} className="text-text-muted" />
                                                                )}
                                                                <span className={`font-medium ${isActive ? "text-brand" : "text-text-base"}`}>{lesson.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                {lesson.isFree && !isAlreadyEnrolled && (
                                                                    <span className="text-[10px] font-black uppercase text-brand bg-brand/10 px-2 py-1 rounded-md">Free Preview</span>
                                                                )}
                                                                {(isAlreadyEnrolled || isAdmin) && (
                                                                    <div
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleToggleProgress(lesson.id, lesson.isCompleted);
                                                                        }}
                                                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                                                            ${lesson.isCompleted
                                                                                ? "bg-green-500 border-green-500 text-white"
                                                                                : "border-border-dim hover:border-brand"}
                                                                        `}
                                                                    >
                                                                        {lesson.isCompleted && <CheckCircle2 size={14} />}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ACTION CARD */}
                        <div className="relative">
                            <div className="bg-bg-card border border-border-dim rounded-3xl p-8 shadow-xl sticky top-8">
                                <div className="mb-6">
                                    <p className="text-text-muted text-sm font-bold uppercase mb-1">Course Price</p>
                                    <span className="text-4xl font-black text-text-base">
                                        {course.price === 0 ? "FREE" : `$${course.price}`}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-text-muted bg-bg-main/50 p-3 rounded-xl">
                                        <Clock size={20} className="text-brand" />
                                        <span className="text-sm font-bold">Self-Paced Learning</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-muted bg-bg-main/50 p-3 rounded-xl">
                                        <ShieldCheck size={20} className="text-brand" />
                                        <span className="text-sm font-bold">Certificate of Completion</span>
                                    </div>
                                </div>

                                {(isAlreadyEnrolled || isAdmin) && (
                                    <div className="mb-8 p-4 bg-bg-main/30 rounded-2xl border border-border-dim">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black uppercase text-text-muted">Your Progress</span>
                                            <span className="text-xs font-bold text-brand">
                                                {Math.round(((course.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0) / (course.modules?.flatMap(m => m.lessons).length || 1)) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-bg-card rounded-full overflow-hidden border border-border-dim">
                                            <div
                                                className="h-full bg-brand transition-all duration-500"
                                                style={{
                                                    width: `${((course.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0) / (course.modules?.flatMap(m => m.lessons).length || 1)) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-text-muted mt-2 font-bold">
                                            {course.modules?.flatMap(m => m.lessons).filter(l => l.isCompleted).length || 0} of {course.modules?.flatMap(m => m.lessons).length || 0} lessons completed
                                        </p>
                                    </div>
                                )}

                                {isAdmin ? (
                                    <button
                                        onClick={() => navigate("/admin/courses")}
                                        className="w-full py-4 rounded-2xl font-bold text-lg bg-bg-main text-text-base border border-border-dim hover:border-brand transition-all flex items-center justify-center gap-2"
                                    >
                                        Manage Content <ExternalLink size={18} />
                                    </button>
                                ) : isSuccess ? (
                                    <div className="flex flex-col items-center gap-2 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 font-bold">
                                        <CheckCircle2 size={40} />
                                        <span>Welcome to the course!</span>
                                    </div>
                                ) : isAlreadyEnrolled ? (
                                    <button
                                        onClick={() => navigate(`/dashboard/learn/${course.id}`)}
                                        className="w-full py-4 rounded-2xl font-bold text-lg bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all"
                                    >
                                        Go to Learning Area
                                    </button>
                                ) : (
                                    <button
                                        disabled={isProcessing}
                                        onClick={handleEnroll}
                                        className="w-full py-4 rounded-2xl font-bold text-lg bg-brand text-white shadow-lg hover:bg-brand-hover hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
                                    >
                                        {isProcessing ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            course.price === 0 ? "Enroll Now" : "Unlock Full Access"
                                        )}
                                    </button>
                                )}

                                <p className="text-center text-[11px] text-text-muted mt-6 leading-relaxed">
                                    Secure checkout via Stripe. Access content immediately after purchase.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetail;