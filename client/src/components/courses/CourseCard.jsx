import { useNavigate, useLocation } from "react-router-dom";

const CourseCard = ({ id, title, desc, duration, type, img, price, onSyllabusClick, onEnrollClick }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = () => {
    if (price !== undefined) {
      // If price exists, it's the catalog view. 
      // Stay in dashboard if we are already there, otherwise use public route.
      const targetPrefix = pathname.startsWith('/dashboard') ? '/dashboard' : '';
      navigate(`${targetPrefix}/course/${id}`);
    } else if (onSyllabusClick) {
      onSyllabusClick();
    }
  };

  return (
    <div className="bg-bg-card rounded-2xl border border-border-dim overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      <div className="h-44 overflow-hidden relative">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-center mb-2">
          <span className="text-brand font-bold text-xs uppercase">{duration}</span>
          {/* If price exists (Explore mode), show it */}
          {price !== undefined && (
            <span className="text-text-base font-extrabold text-sm">
              {price === 0 ? "Free" : `$${price}`}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-text-base mb-2 leading-snug">{title}</h3>
        <p className="text-text-muted text-xs line-clamp-2 mb-4">{desc}</p>

        <button
          onClick={handleClick}
          className="mt-auto w-full py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-colors text-sm"
        >
          {price !== undefined ? "Enroll Now" : "View Syllabus"}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;