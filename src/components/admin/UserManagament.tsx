import React, { useState, useEffect } from 'react';
import { Search, Mail, Shield, User, Trash2 } from 'lucide-react';

interface UserData {
    id: string;
    username: string;
    email: string;
    role: string;
    created_at: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                alert('Xóa người dùng thành công!');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Không thể xóa người dùng!');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-white">
                        <span className="text-2xl font-bold">{filteredUsers.length}</span>
                        <span className="text-gray-400 ml-2">người dùng</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <User className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Người dùng</p>
                            <p className="text-2xl font-bold text-white">
                                {users.filter(u => u.role === 'user').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Shield className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Quản trị viên</p>
                            <p className="text-2xl font-bold text-white">
                                {users.filter(u => u.role === 'admin').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Mail className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Tổng số</p>
                            <p className="text-2xl font-bold text-white">{users.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Người dùng
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Vai trò
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Mail size={16} className="text-gray-500" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`
                      inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                      ${user.role === 'admin'
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            }
                    `}>
                                            {user.role === 'admin' ? (
                                                <>
                                                    <Shield size={12} />
                                                    Quản trị viên
                                                </>
                                            ) : (
                                                <>
                                                    <User size={12} />
                                                    Người dùng
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {formatDate(user.created_at)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={user.role === 'admin'}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={user.role === 'admin' ? 'Không thể xóa admin' : 'Xóa người dùng'}
                                        >
                                            <Trash2 size={16} />
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <User className="mx-auto text-gray-600 mb-4" size={48} />
                        <p className="text-gray-400">Không tìm thấy người dùng nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;