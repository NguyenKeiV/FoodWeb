// src/components/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Calendar,
    Shield,
    Edit2,
    Save,
    X,
    Loader2,
    ShoppingBag,
    Lock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

interface UserData {
    id: string;
    username: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface EditFormData {
    username: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'https://foodweb-be.onrender.com/api';

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState<EditFormData>({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Load user data from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            window.location.href = '/login';
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormData({
                username: parsedUser.username,
                email: parsedUser.email,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
            window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-hide message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
        setIsEditing(false);
        setMessage(null);
    };

    const handleSave = async () => {
        if (!user) return;

        // Validation
        if (!formData.username.trim()) {
            setMessage({ type: 'error', text: 'Tên người dùng không được để trống!' });
            return;
        }

        if (!formData.email.trim()) {
            setMessage({ type: 'error', text: 'Email không được để trống!' });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage({ type: 'error', text: 'Email không hợp lệ!' });
            return;
        }

        // If changing password, validate
        if (formData.newPassword || formData.confirmPassword) {
            if (!formData.currentPassword) {
                setMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại!' });
                return;
            }

            if (formData.newPassword !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
                return;
            }

            if (formData.newPassword.length < 6) {
                setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
                return;
            }
        }

        try {
            setSaving(true);
            setMessage(null);

            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            // Prepare update data
            const updateData: any = {
                username: formData.username.trim(),
                email: formData.email.trim()
            };

            // Only include password if user wants to change it
            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                // Update localStorage
                const updatedUser = { ...user, ...data.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);

                setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
                setIsEditing(false);

                // Clear password fields
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else {
                setMessage({ type: 'error', text: data.error || data.message || 'Cập nhật thất bại!' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Không thể kết nối đến server!' });
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUserInitials = () => {
        if (!user) return '?';
        return user.username.substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-white" size={48} />
                    <p className="text-white text-lg">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6 min-h-screen">
            {/* Message Banner */}
            {message && (
                <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl ${message.type === 'success'
                        ? 'bg-green-500/90'
                        : 'bg-red-500/90'
                    } text-white flex items-start gap-3 animate-slide-in`}>
                    {message.type === 'success' ? (
                        <CheckCircle size={24} className="flex-shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
                    )}
                    <p className="font-semibold">{message.text}</p>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                    <User size={40} />
                    Thông tin cá nhân
                </h1>
                <p className="text-emerald-100 mt-2">Quản lý thông tin tài khoản của bạn</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
                {/* Header Section with Avatar */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                            {getUserInitials()}
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">{user.username}</h2>
                            <p className="text-emerald-100 flex items-center gap-2 justify-center sm:justify-start">
                                <Mail size={16} />
                                {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                                <Shield size={16} className="text-yellow-300" />
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-semibold">
                                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                    {!isEditing ? (
                        /* View Mode */
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-emerald-200 text-sm font-semibold flex items-center gap-2">
                                        <User size={16} />
                                        Tên người dùng
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                                        {user.username}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-emerald-200 text-sm font-semibold flex items-center gap-2">
                                        <Mail size={16} />
                                        Email
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-emerald-200 text-sm font-semibold flex items-center gap-2">
                                        <Calendar size={16} />
                                        Ngày tạo tài khoản
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                                        {formatDate(user.created_at)}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-emerald-200 text-sm font-semibold flex items-center gap-2">
                                        <Calendar size={16} />
                                        Cập nhật lần cuối
                                    </label>
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                                        {formatDate(user.updated_at)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
                                >
                                    <Edit2 size={20} />
                                    Chỉnh sửa thông tin
                                </button>

                                <button
                                    onClick={() => window.location.href = '/order-history'}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                                >
                                    <ShoppingBag size={20} />
                                    Lịch sử đơn hàng
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Edit Mode */
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-emerald-200 text-sm font-semibold flex items-center gap-2">
                                        <User size={16} />
                                        Tên người dùng <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                                        placeholder="Nhập tên người dùng"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-emerald-200 text-sm font-semibold flex items-center gap-2">
                                        <Mail size={16} />
                                        Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                                        placeholder="Nhập email"
                                    />
                                </div>
                            </div>

                            {/* Password Change Section */}
                            <div className="border-t border-white/20 pt-6 mt-6">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <Lock size={20} />
                                    Đổi mật khẩu (Tùy chọn)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-emerald-200 text-sm font-semibold">
                                            Mật khẩu hiện tại
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-emerald-200 text-sm font-semibold">
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-emerald-200 text-sm font-semibold">
                                            Xác nhận mật khẩu
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <p className="text-emerald-200 text-sm mt-2">
                                    * Chỉ điền nếu bạn muốn thay đổi mật khẩu
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Lưu thay đổi
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X size={20} />
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;