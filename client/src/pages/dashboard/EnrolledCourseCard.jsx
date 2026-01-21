import { Link } from "react-router-dom";

const EnrolledCourseCard = ({ course, progress = 45, onSyllabusClick }) => (
  <div className="bg-bg-card border border-border-dim rounded-2xl overflow-hidden group hover:border-brand transition-all flex flex-col h-full">
    <img src={course.thumbnailUrl || "/Assets/placeholder.jpg"} className="h-32 w-full object-cover" alt="" />
    <div className="p-4 flex flex-col flex-1">
      <h3 className="font-bold text-text-base mb-2 line-clamp-1">{course.title}</h3>
      <div className="flex justify-between text-xs text-text-muted mb-1 font-bold">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden mb-4">
        <div className="bg-brand h-full transition-all" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        <Link to={`/dashboard/learn/${course.id || '1'}`} className="text-center py-2 bg-brand text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:brightness-110 transition-all">
          Learn
        </Link>
        <button
          onClick={onSyllabusClick}
          className="text-center py-2 bg-bg-main hover:bg-bg-hover text-text-muted hover:text-text-base rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-border-dim"
        >
          Syllabus
        </button>
      </div>
    </div>
  </div>
);

export default EnrolledCourseCard