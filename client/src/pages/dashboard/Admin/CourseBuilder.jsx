import { useState } from "react";
import Sidebar from "../SideBar";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Check, Video, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api";

const CourseBuilder = () => {
  const [courseInfo, setCourseInfo] = useState({
    title: "",
    description: "",
    price: "",
    thumbnailUrl: ""
  });

  const [modules, setModules] = useState([
    {
      id: Date.now().toString(),
      title: "Module 1: Introduction",
      lessons: [{
        id: (Date.now() + 1).toString(),
        title: "Lesson 1: Welcome",
        videoUrl: "",
        content: "",
        isFree: false
      }]
    }
  ]);

  const addModule = () => {
    setModules([...modules, {
      id: Date.now().toString(),
      title: `Module ${modules.length + 1}`,
      lessons: []
    }]);
  };

  const removeModule = (moduleId) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const addLesson = (moduleId) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, {
            id: Date.now().toString(),
            title: `New Lesson ${m.lessons.length + 1}`,
            videoUrl: "",
            content: "",
            isFree: false
          }]
        };
      }
      return m;
    }));
  };

  const removeLesson = (moduleId, lessonId) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.id !== lessonId)
        };
      }
      return m;
    }));
  };

  const updateModuleTitle = (moduleId, title) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, title } : m));
  };

  const updateLessonField = (moduleId, lessonId, field, value) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
        };
      }
      return m;
    }));
  };

  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!courseInfo.title || !courseInfo.price) {
      alert("Please provide at least a title and price.");
      return;
    }

    setIsPublishing(true);
    try {
      // Format data for backend
      const formattedModules = modules.map((m, mIdx) => ({
        title: m.title,
        order: mIdx + 1,
        lessons: m.lessons.map((l, lIdx) => ({
          title: l.title,
          videoUrl: l.videoUrl,
          content: l.content,
          order: lIdx + 1,
          isFree: l.isFree
        }))
      }));

      const payload = {
        ...courseInfo,
        modules: formattedModules
      };

      // sending data to ty
      const { data } = await api.post("/courses", payload);

      if (data.success) {
        alert("Course published successfully!");
        navigate("/admin/courses");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish course: " + (error.response?.data?.message || error.message));
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-1 h-full bg-bg-main text-text-base">
      <Sidebar role="ADMIN" />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <header className="flex justify-between items-center bg-bg-card p-6 rounded-2xl border border-border-dim shadow-sm">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Course Builder
            </h1>
            <p className="text-text-muted text-sm mt-1">Design your curriculum and course details.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`bg-brand text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand/20 transition-all active:scale-95 flex items-center gap-2 ${isPublishing ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : 'Publish Course'}
            </button>
          </div>
        </header>

        {/* Step 1: Basic Info */}
        <section className="bg-bg-card p-8 rounded-3xl border border-border-dim space-y-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold">1</div>
            <h2 className="text-xl font-bold">Basic Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-text-muted mb-1 block ml-1">Title</label>
              <input
                type="text"
                placeholder="Course Title (e.g. Advanced React)"
                value={courseInfo.title}
                onChange={(e) => setCourseInfo({ ...courseInfo, title: e.target.value })}
                className="w-full p-4 bg-bg-main border border-border-dim rounded-2xl focus:border-brand outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-text-muted mb-1 block ml-1">Description</label>
              <textarea
                placeholder="Course Description"
                value={courseInfo.description}
                onChange={(e) => setCourseInfo({ ...courseInfo, description: e.target.value })}
                className="w-full p-4 bg-bg-main border border-border-dim rounded-2xl h-32 focus:border-brand outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase text-text-muted mb-1 block ml-1">Price ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={courseInfo.price}
                  onChange={(e) => setCourseInfo({ ...courseInfo, price: e.target.value })}
                  className="w-full p-4 bg-bg-main border border-border-dim rounded-2xl focus:border-brand outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-text-muted mb-1 block ml-1">Thumbnail URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={courseInfo.thumbnailUrl}
                  onChange={(e) => setCourseInfo({ ...courseInfo, thumbnailUrl: e.target.value })}
                  className="w-full p-4 bg-bg-main border border-border-dim rounded-2xl focus:border-brand outline-none transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Curriculum Builder */}
        <section className="bg-bg-card p-8 rounded-3xl border border-border-dim space-y-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold">2</div>
              <h2 className="text-xl font-bold">Curriculum Builder</h2>
            </div>
          </div>

          <div className="space-y-4">
            {modules.map((module, mIdx) => (
              <div key={module.id} className="group border border-border-dim rounded-2xl overflow-hidden bg-bg-main/30 hover:border-brand/30 transition">
                <div className="flex justify-between items-center p-4 bg-bg-card/50 border-b border-border-dim">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="text-text-muted cursor-grab" size={20} />
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                      className="font-bold bg-transparent border-none outline-none flex-1 text-lg placeholder:text-text-muted/50"
                      placeholder="Module Title"
                    />
                  </div>
                  <button
                    onClick={() => removeModule(module.id)}
                    className="p-2 text-text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {module.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="relative bg-bg-card rounded-xl border border-border-dim group/lesson hover:shadow-md transition overflow-hidden">
                      <div className="flex items-center gap-3 p-4 bg-bg-main/20 border-b border-border-dim/50">
                        <div className="w-6 h-6 bg-brand/5 text-brand text-[10px] flex items-center justify-center rounded-md font-bold shrink-0">
                          {lIdx + 1}
                        </div>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLessonField(module.id, lesson.id, "title", e.target.value)}
                          className="bg-transparent border-none outline-none flex-1 font-bold text-sm"
                          placeholder="Lesson Title"
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={lesson.isFree}
                              onChange={(e) => updateLessonField(module.id, lesson.id, "isFree", e.target.checked)}
                              className="w-3 h-3 accent-brand"
                            />
                            <span className="text-[10px] font-black uppercase text-text-muted">Free</span>
                          </label>
                          <button
                            onClick={() => removeLesson(module.id, lesson.id)}
                            className="p-2 text-text-muted hover:text-red-500 transition shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-text-muted uppercase mb-1">
                            <Video size={12} /> Video URL
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. https://youtube.com/..."
                            value={lesson.videoUrl}
                            onChange={(e) => updateLessonField(module.id, lesson.id, "videoUrl", e.target.value)}
                            className="w-full text-xs p-2.5 bg-bg-main border border-border-dim rounded-lg focus:border-brand/50 outline-none transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-text-muted uppercase mb-1">
                            <FileText size={12} /> Text Content
                          </div>
                          <textarea
                            placeholder="Lesson notes or text content..."
                            value={lesson.content}
                            onChange={(e) => updateLessonField(module.id, lesson.id, "content", e.target.value)}
                            className="w-full text-xs p-2.5 bg-bg-main border border-border-dim rounded-lg focus:border-brand/50 outline-none transition resize-none h-9.5]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addLesson(module.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border-dim rounded-xl text-text-muted text-sm font-bold hover:bg-brand/5 hover:text-brand hover:border-brand/50 transition group"
                  >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                    Add Lesson
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addModule}
              className="w-full py-6 border-2 border-dashed border-brand/20 text-brand font-bold rounded-2xl hover:bg-brand/5 hover:border-brand/50 transition flex items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <Plus size={24} />
              </div>
              <span>Add New Module</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseBuilder;
