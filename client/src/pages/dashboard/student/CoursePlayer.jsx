import { useState, useEffect } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  CheckCircle,
  Play,
  FileText,
  Loader2,
} from "lucide-react"
import { Link } from "react-router-dom"
import Sidebar from "../SideBar"
import api from "../../../service/api"
import { verifyPaymentSession, updateLessonProgress } from "../../../service/student"

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSuccessRedirect = searchParams.get("success") === "true";

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(isSuccessRedirect);
  const [verificationError, setVerificationError] = useState(null);

  useEffect(() => {
    const initPlayer = async () => {
      try {
        // 1. If coming from Stripe success, trigger manual verification fallback
        if (isSuccessRedirect) {
          try {
            await verifyPaymentSession(courseId);
          } catch (err) {
            console.error("Manual verification failed:", err);
            setVerificationError(err.message || "Could not verify payment. Please try refreshing or contact support.");
          } finally {
            setVerifying(false);
          }
        }

        // 2. Fetch real course content
        const { data } = await api.get(`/courses/${courseId}`);
        const courseData = data.data;
        setCourse(courseData);

        // 3. Set initial lesson if available
        if (courseData.modules?.[0]?.lessons?.[0]) {
          setCurrentLesson(courseData.modules[0].lessons[0]);
        }
      } catch (error) {
        console.error("Player initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initPlayer();
  }, [courseId, isSuccessRedirect]);

  if (loading || verifying) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-bg-main gap-4 p-8 text-center">
        {verificationError ? (
          <>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 rotate-45" />
            </div>
            <h2 className="text-xl font-bold text-text-base">Verification Error</h2>
            <p className="text-text-muted max-w-md">{verificationError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-brand text-white rounded-lg font-bold"
            >
              Retry Verification
            </button>
            <Link to="/dashboard/my-courses" className="text-sm text-text-muted hover:underline mt-2">
              Back to Dashboard
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 text-brand animate-spin" />
            <p className="text-text-muted font-bold animate-pulse">
              {verifying ? "Verifying Payment..." : "Loading Course..."}
            </p>
          </>
        )}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-bg-main gap-4">
        <h2 className="text-2xl font-bold text-text-base">Course not found</h2>
        <Link to="/dashboard/my-courses" className="text-brand hover:underline font-bold">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full bg-bg-main overflow-hidden">
      <Sidebar role="STUDENT" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 bg-bg-card border-b border-border-dim px-6 flex items-center justify-between shrink-0">
          <Link
            to="/dashboard/my-courses"
            className="flex items-center gap-2 text-text-muted hover:text-brand transition-colors font-bold"
          >
            <ChevronLeft size={20} />
            Back to Dashboard
          </Link>

          <h2 className="text-sm font-bold text-text-base hidden md:block">
            {course.title}
          </h2>

          <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1 rounded-full">
            In Progress
          </span>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video bg-black rounded-2xl shadow-2xl mb-8 flex items-center justify-center overflow-hidden relative group">
                {currentLesson?.videoUrl ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                ) : (
                  <div className="text-white flex flex-col items-center">
                    <Play size={64} className="text-brand fill-brand mb-4 opacity-50" />
                    <p className="font-bold text-text-muted">No video for this lesson</p>
                  </div>
                )}
              </div>

              <div className="bg-bg-card p-8 rounded-2xl border border-border-dim shadow-sm">
                <h1 className="text-3xl font-extrabold text-text-base mb-4">
                  {currentLesson?.title || "Welcome to the Course"}
                </h1>

                <div className="prose dark:prose-invert max-w-none text-text-muted">
                  {currentLesson?.content || "Watch the video or check the curriculum to get started."}
                </div>

                <div className="mt-10 pt-6 border-t border-border-dim flex justify-between">
                  <button className="px-6 py-2 rounded-lg border border-border-dim font-bold hover:bg-bg-main transition-colors text-xs uppercase tracking-widest">
                    Previous
                  </button>
                  <button className="px-8 py-2 bg-brand text-white rounded-lg font-bold hover:bg-brand-hover shadow-lg shadow-brand/20 text-xs uppercase tracking-widest">
                    Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          </main>

          <aside className="w-80 bg-bg-card border-l border-border-dim hidden lg:flex flex-col shrink-0">
            <div className="p-4 border-b border-border-dim bg-bg-main/50">
              <h3 className="font-bold text-text-base">Course Content</h3>
            </div>

            <div className="flex-1 overflow-y-auto">
              {course.modules?.map((module, moduleIndex) => (
                <div key={module.id} className="border-b border-border-dim last:border-0">
                  <div className="p-4 bg-bg-main/20 flex items-center gap-2">
                    <span className="text-[10px] font-black text-brand bg-brand/10 w-5 h-5 flex items-center justify-center rounded-full">
                      {moduleIndex + 1}
                    </span>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      {module.title}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    {module.lessons?.map((lesson) => {
                      const isActive = currentLesson?.id === lesson.id
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`flex items-center gap-3 p-4 text-left transition-all ${isActive
                            ? "bg-brand/5 border-l-4 border-brand"
                            : "hover:bg-bg-main/50 border-l-4 border-transparent"
                            }`}
                        >
                          {isActive ? (
                            <Play size={16} className="text-brand fill-brand" />
                          ) : (
                            <CheckCircle size={16} className="text-slate-300" />
                          )}

                          <div className="flex-1">
                            <p className={`text-sm font-bold ${isActive ? "text-brand" : "text-text-base"}`}>
                              {lesson.title}
                            </p>
                            <span className="text-[10px] text-text-muted flex items-center gap-1">
                              {lesson.videoUrl ? <Play size={10} /> : <FileText size={10} />}
                              {lesson.videoUrl ? "Video" : "Article"}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CoursePlayer
