import { createContext, useContext, useState, useCallback } from "react";
import { getStudentStats, getExploreCourses } from "./student";
import api from "./api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [catalog, setCatalog] = useState(null);
    const [courseDetails, setCourseDetails] = useState({}); // { courseId: data }
    const [loading, setLoading] = useState({
        stats: false,
        catalog: false,
        courses: {}
    });

    const fetchStats = useCallback(async (force = false) => {
        if (stats && !force) return stats;

        setLoading(prev => ({ ...prev, stats: true }));
        try {
            const data = await getStudentStats();
            setStats(data.data);
            return data.data;
        } catch (error) {
            console.error("DataContext: Fetch stats error:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    }, [stats]);

    const fetchCatalog = useCallback(async (force = false) => {
        if (catalog && !force) return catalog;

        setLoading(prev => ({ ...prev, catalog: true }));
        try {
            const data = await getExploreCourses();
            const publishedCourses = data.data.filter(c => c.status === 'PUBLISHED');
            setCatalog(publishedCourses);
            return publishedCourses;
        } catch (error) {
            console.error("DataContext: Fetch catalog error:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, catalog: false }));
        }
    }, [catalog]);

    const fetchCourse = useCallback(async (courseId, force = false) => {
        if (courseDetails[courseId] && !force) return courseDetails[courseId];

        setLoading(prev => ({
            ...prev,
            courses: { ...prev.courses, [courseId]: true }
        }));
        try {
            const { data } = await api.get(`/courses/${courseId}`);
            const courseData = data.data;
            setCourseDetails(prev => ({ ...prev, [courseId]: courseData }));
            return courseData;
        } catch (error) {
            console.error(`DataContext: Fetch course ${courseId} error:`, error);
            throw error;
        } finally {
            setLoading(prev => ({
                ...prev,
                courses: { ...prev.courses, [courseId]: false }
            }));
        }
    }, [courseDetails]);

    const invalidateCache = useCallback((key) => {
        if (key === 'stats') setStats(null);
        if (key === 'catalog') setCatalog(null);
        if (key.startsWith('course-')) {
            const courseId = key.replace('course-', '');
            setCourseDetails(prev => {
                const newDetails = { ...prev };
                delete newDetails[courseId];
                return newDetails;
            });
        }
        if (key === 'all') {
            setStats(null);
            setCatalog(null);
            setCourseDetails({});
        }
    }, []);

    return (
        <DataContext.Provider value={{
            stats,
            catalog,
            courseDetails,
            loading,
            fetchStats,
            fetchCatalog,
            fetchCourse,
            invalidateCache,
            setCourseDetails,
            setStats
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
