import { X, Play, FileText, CheckCircle2 } from "lucide-react";

const SyllabusModal = ({ isOpen, onClose, courseTitle }) => {
    if (!isOpen) return null;

    // Mock syllabus data
    const modules = [
        {
            id: 1,
            title: "Module 1: Getting Started",
            lessons: [
                { id: 101, title: "Introduction & Setup", type: "video" },
                { id: 102, title: "Architecture Overview", type: "document" },
            ]
        },
        {
            id: 2,
            title: "Module 2: Core Concepts",
            lessons: [
                { id: 201, title: "Deep Dive into Theory", type: "video" },
                { id: 202, title: "Practical Implementation", type: "video" },
                { id: 203, title: "Module Quiz", type: "document" },
            ]
        },
        {
            id: 3,
            title: "Module 3: Advanced Topics",
            lessons: [
                { id: 301, title: "Performance Optimization", type: "video" },
                { id: 302, title: "Best Practices", type: "document" },
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-card w-full max-w-2xl rounded-3xl border border-border-dim shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border-dim flex justify-between items-center bg-bg-main/50">
                    <div>
                        <span className="text-brand text-[10px] font-black uppercase tracking-widest mb-1 block">Course Syllabus</span>
                        <h2 className="text-2xl font-black text-text-base">{courseTitle}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-bg-main rounded-xl transition-colors text-text-muted hover:text-text-base"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 custom-scrollbar">
                    {modules.map((module, mIdx) => (
                        <div key={module.id} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
                                    {mIdx + 1}
                                </div>
                                <h3 className="font-bold text-text-base">{module.title}</h3>
                            </div>

                            <div className="grid gap-2 ml-4 border-l-2 border-border-dim/50 pl-6">
                                {module.lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="flex justify-between items-center p-3 rounded-xl bg-bg-main/30 border border-transparent hover:border-brand/20 transition-all hover:bg-bg-main/50 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {lesson.type === 'video' ? (
                                                <Play size={14} className="text-brand fill-brand" />
                                            ) : (
                                                <FileText size={14} className="text-text-muted" />
                                            )}
                                            <span className="text-sm font-medium text-text-muted group-hover:text-text-base transition-colors">
                                                {lesson.title}
                                            </span>
                                        </div>
                                        <CheckCircle2 size={16} className="text-border-dim" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 bg-bg-main/50 border-t border-border-dim flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-brand text-white font-black rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SyllabusModal;
