// src/components/Register.tsx
import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        username: string;
        email: string;
        role: string;
        created_at: string;
        updated_at: string;
    };
    error?: string;
}

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'https://foodweb-be.onrender.com/api';

const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user types
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = (): boolean => {
        // Check empty fields
        if (!formData.username.trim()) {
            setError('Tên người dùng không được để trống');
            return false;
        }

        if (formData.username.length < 3) {
            setError('Tên người dùng phải có ít nhất 3 ký tự');
            return false;
        }

        if (formData.username.length > 50) {
            setError('Tên người dùng không được quá 50 ký tự');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Email không được để trống');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ');
            return false;
        }

        if (!formData.password) {
            setError('Mật khẩu không được để trống');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: 'user' // Default role
                }),
            });

            const data: RegisterResponse = await response.json();

            if (data.success && data.data) {
                setSuccess('Đăng ký thành công! Đang chuyển hướng...');

                // Clear form
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(data.error || data.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            setError('Không thể kết nối đến server. Vui lòng thử lại.');
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative h-screen w-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8 max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
                        Tạo tài khoản mới
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Đăng ký để trải nghiệm dịch vụ của chúng tôi
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Success Message */}
                    {success && (
                        <div className="rounded-lg bg-green-500/20 border border-green-500/50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-300">{success}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-300">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Tên người dùng
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full px-4 py-3 backdrop-blur-md bg-white/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-sm"
                                placeholder="Nhập tên người dùng (3-50 ký tự)"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                minLength={3}
                                maxLength={50}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 backdrop-blur-md bg-white/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-sm"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className="w-full px-4 py-3 pr-12 backdrop-blur-md bg-white/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Ít nhất 6 ký tự"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    className="w-full px-4 py-3 pr-12 backdrop-blur-md bg-white/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white font-medium shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Đang đăng ký...
                                </span>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-gray-400">
                            Đã có tài khoản?{' '}
                            <a href="/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                Đăng nhập ngay
                            </a>
                        </span>
                    </div>
                </form>

                {/* Terms */}
                <div className="mt-4">
                    <p className="text-xs text-gray-400 text-center">
                        Bằng việc đăng ký, bạn đồng ý với{' '}
                        <a href="#" className="text-emerald-400 hover:text-emerald-300">
                            Điều khoản dịch vụ
                        </a>{' '}
                        và{' '}
                        <a href="#" className="text-emerald-400 hover:text-emerald-300">
                            Chính sách bảo mật
                        </a>{' '}
                        của chúng tôi
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;