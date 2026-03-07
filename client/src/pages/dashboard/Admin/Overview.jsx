import { useState, useEffect } from "react";
import Sidebar from "../SideBar";
import StatCard from "../StatCard";
import { Users, BookOpen, DollarSign, Activity, ArrowRight, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../service/api";
import Loading from "../../../components/ui/Loading";
import Avatar from "../../../components/ui/Avatar";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/stats/admin");
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) return <Loading text="Fetching administrative data..." />;
  console.log("the data from admin stat is ", stats)

  const { totalRevenue, totalSales, totalStudents, totalCourses, recentSales } = stats || {};

  return (
    <div className="flex flex-1 h-full bg-bg-main text-text-base">
      <Sidebar role="ADMIN" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Admin Overview</h1>
            <p className="text-text-muted mt-1">Platform performance and management overview.</p>
          </div>

        </header>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Students" value={totalStudents?.toLocaleString()} icon={<Users />} colorClass="text-blue-500" />
          <StatCard title="Active Courses" value={totalCourses?.toLocaleString()} icon={<BookOpen />} colorClass="text-purple-500" />
          <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign />} colorClass="text-green-500" />
          <StatCard title="Enrollments" value={totalSales?.toLocaleString()} icon={<Activity />} colorClass="text-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Enrollments Table */}
          <div className="lg:col-span-2 bg-bg-card p-6 rounded-3xl border border-border-dim shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Enrollments</h2>

            </div>
            <div className="space-y-4">
              {recentSales?.length > 0 ? (
                recentSales.map((sale, i) => (
                  <div key={sale.id || i} className="flex justify-between items-center p-4 hover:bg-bg-main/50 rounded-2xl transition border border-transparent hover:border-border-dim">
                    <div className="flex items-center gap-4">
                      <Avatar user={{ firstName: sale.user?.firstName, email: sale.user?.email }} size="sm" />
                      <div>
                        <p className="font-bold">{sale.user?.firstName} {sale.user?.lastName}</p>
                        <p className="text-xs text-text-muted">Enrolled in <span className="text-text-base font-medium">{sale.course?.title}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-600">+{formatCurrency(sale.amountPaid)}</p>
                      <p className="text-[10px] text-text-muted uppercase font-bold">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-text-muted">
                  No recent enrollments found.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-bg-card p-6 rounded-3xl border border-border-dim shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 ">
              <Link
                to="/admin/courses/create"
                className="p-4 bg-brand/5 border border-brand/20 rounded-2xl text-brand font-black text-center hover:bg-brand hover:text-white transition-all transform hover:-translate-y-1 shadow-sm active:scale-95"
              >
                Create New Course
              </Link>

              <Link
                to="/admin/courses"
                className="p-4 bg-bg-main border border-border-dim rounded-2xl font-black text-center hover:border-brand hover:text-brand transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Course Catalog
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOverview;
