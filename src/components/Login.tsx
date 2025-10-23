import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
    email: string;
    password: string;
}

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: User;
    };
    error?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate form
        if (!formData.email || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data: LoginResponse = await response.json();

            if (data.success && data.data) {
                // Save token and user to localStorage
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));

                // Role-based redirect
                const userRole = data.data.user.role.toLowerCase();

                if (userRole === 'admin') {
                    // Redirect to admin dashboard
                    navigate('/admin');
                } else {
                    // Redirect to user dashboard/home
                    navigate('/');
                }
            } else {
                setError(data.error || data.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Không thể kết nối đến server. Vui lòng thử lại.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative h-screen w-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8 max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
                        Đăng nhập vào tài khoản
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Nhập thông tin đăng nhập của bạn
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-300">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
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
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 backdrop-blur-md bg-white/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded bg-white/10"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="/forgot-password" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                Quên mật khẩu?
                            </a>
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
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <span className="text-sm text-gray-400">
                            Chưa có tài khoản?{' '}
                            <a href="/register" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                Đăng ký ngay
                            </a>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;