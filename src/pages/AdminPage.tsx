import React, { useState } from 'react';
import {
    LayoutDashboard,
    UtensilsCrossed,
    Users,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FoodManagement from '../components/admin/FoodManagement';
import UserManagement from '../components/admin/UserManagament';
import Dashboard from '../components/admin/Dashboard';

type ActiveTab = 'dashboard' | 'foods' | 'users';

const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user is admin
    React.useEffect(() => {
        if (user.role !== 'admin') {
            alert('Bạn không có quyền truy cập trang này!');
            navigate('/');
        }
    }, [user.role, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { id: 'dashboard' as ActiveTab, icon: LayoutDashboard, label: 'Tổng quan', color: 'text-blue-400' },
        { id: 'foods' as ActiveTab, icon: UtensilsCrossed, label: 'Quản lý món ăn', color: 'text-emerald-400' },
        { id: 'users' as ActiveTab, icon: Users, label: 'Quản lý người dùng', color: 'text-purple-400' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-72 bg-slate-800/50 backdrop-blur-xl border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                            <p className="text-sm text-gray-400 mt-1">{user.username}</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                                            ? 'bg-white/10 text-white shadow-lg'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }
                  `}
                                >
                                    <Icon className={isActive ? item.color : ''} size={22} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut size={22} />
                        <span className="font-medium">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="bg-slate-800/30 backdrop-blur-sm border-b border-white/10 p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-white"
                            >
                                <Menu size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-white">
                                {menuItems.find(item => item.id === activeTab)?.label}
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm text-gray-400">Chào mừng trở lại</p>
                                <p className="text-white font-semibold">{user.username}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                {user.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-4 lg:p-8 ">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'foods' && <FoodManagement />}
                    {activeTab === 'users' && <UserManagement />}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;