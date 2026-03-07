import { useState, useEffect } from "react";
import Sidebar from "../SideBar";
import StatCard from "../StatCard";
import { DollarSign, TrendingUp, CreditCard, BarChart3, Loader2, Users } from "lucide-react";
import api from "../../../service/api";
import Loading from "../../../components/ui/Loading";

const Sales = () => {
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
                console.error("Error fetching sales stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };


    return (
        <div className="flex flex-1 h-full bg-bg-main">
            <Sidebar role="ADMIN" />

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-black">Sales & Finance</h1>
                    <p className="text-text-muted">Monitor revenue, transactions, and performance metrics.</p>
                </header>

                {loading ? (
                    <Loading text="Retrieving financial registers..." />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <StatCard
                                title="Total Revenue"
                                value={formatCurrency(stats?.totalRevenue || 0)}
                                icon={<DollarSign />}
                                colorClass="text-green-500"
                            />
                            <StatCard
                                title="Total Sales"
                                value={stats?.totalSales || 0}
                                icon={<TrendingUp />}
                                colorClass="text-blue-500"
                            />
                            <StatCard
                                title="Active Courses"
                                value={stats?.totalCourses || 0}
                                icon={<BarChart3 />}
                                colorClass="text-orange-500"
                            />
                            <StatCard
                                title="Total Students"
                                value={stats?.totalStudents || 0}
                                icon={<Users />}
                                colorClass="text-purple-500"
                            />
                        </div>

                        <div className="bg-bg-card rounded-3xl border border-border-dim overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-border-dim flex justify-between items-center">
                                <h2 className="text-xl font-bold">Recent Transactions</h2>
                                <span className="text-xs font-black uppercase tracking-widest text-text-muted">Live Feed</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-bg-main border-b border-border-dim">
                                        <tr>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Student</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Course</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Amount</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted">Date</th>
                                            <th className="p-4 font-bold text-xs uppercase tracking-widest text-text-muted text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats?.recentSales?.map((sale) => (
                                            <tr key={sale.id} className="border-b border-border-dim hover:bg-bg-main/30 transition">
                                                <td className="p-4">
                                                    <div className="font-bold text-text-base">{sale.user.firstName} {sale.user.lastName}</div>
                                                    <div className="text-[10px] text-text-muted font-medium uppercase tracking-tight">{sale.user.email}</div>
                                                </td>
                                                <td className="p-4 font-medium text-sm">{sale.course.title}</td>
                                                <td className="p-4 font-black text-brand">{formatCurrency(sale.amountPaid)}</td>
                                                <td className="p-4 text-text-muted text-xs font-medium">
                                                    {new Date(sale.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-tighter">
                                                        {sale.paymentStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!stats?.recentSales || stats.recentSales.length === 0) && (
                                            <tr>
                                                <td colSpan="5" className="p-20 text-center text-text-muted font-bold">
                                                    No transactions recorded yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Sales;
