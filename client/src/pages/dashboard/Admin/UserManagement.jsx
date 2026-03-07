import { useState, useEffect } from "react";
import Sidebar from "../SideBar";
import { UserX, Search, Filter, Loader2 } from "lucide-react";
import api from "../../../service/api";
import Loading from "../../../components/ui/Loading";
import Avatar from "../../../components/ui/Avatar";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/users");
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action is permanent.")) return;

        try {
            await api.delete(`/users/${userId}`);
            fetchUsers();
        } catch (error) {
            alert("Failed to delete user: " + (error.response?.data?.message || error.message));
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-1 h-full bg-bg-main">
            <Sidebar role="ADMIN" />

            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black">User Management</h1>
                        <p className="text-text-muted">Monitor platform members and manage accounts.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-bg-card border border-border-dim rounded-xl focus:border-brand outline-none transition w-64 text-sm font-medium"
                            />
                        </div>
                    </div>
                </header>

                <div className="bg-bg-card rounded-3xl border border-border-dim overflow-hidden shadow-sm">
                    {loading ? (
                        <Loading text="Fetching user accounts..." />
                    ) : filteredUsers.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-bg-main border-b border-border-dim">
                                <tr>
                                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-text-muted">User</th>
                                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-text-muted text-center">Role</th>
                                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-text-muted text-center">Join Date</th>
                                    <th className="p-4 font-bold text-sm uppercase tracking-wider text-text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border-dim hover:bg-bg-main/30 transition text-sm">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar user={user} size="sm" />
                                                <div>
                                                    <p className="font-bold text-text-base">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-text-muted">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600' : 'bg-brand/10 text-brand'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-text-muted font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                                                    title="Delete Account"
                                                >
                                                    <UserX size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-text-muted font-bold text-lg">No users found matching your search.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
