import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Users, ShoppingBag, TrendingUp } from 'lucide-react';

interface Stats {
    totalFoods: number;
    totalUsers: number;
    totalOrders: number;
    revenue: number;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>({
        totalFoods: 0,
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // TODO: Replace with actual API calls
            // Fake data for now
            setTimeout(() => {
                setStats({
                    totalFoods: 24,
                    totalUsers: 156,
                    totalOrders: 342,
                    revenue: 12500000
                });
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const statCards = [
        {
            title: 'Tổng món ăn',
            value: stats.totalFoods,
            icon: UtensilsCrossed,
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-emerald-500/10',
            iconColor: 'text-emerald-400'
        },
        {
            title: 'Người dùng',
            value: stats.totalUsers,
            icon: Users,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-400'
        },
        {
            title: 'Đơn hàng',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-400'
        },
        {
            title: 'Doanh thu',
            value: formatCurrency(stats.revenue),
            icon: TrendingUp,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-400'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                                    <Icon className={card.iconColor} size={24} />
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
                            <p className="text-3xl font-bold text-white">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Thống kê nhanh</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <span className="text-gray-300">Món ăn bán chạy nhất</span>
                        <span className="text-emerald-400 font-semibold">Salad ức gà</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <span className="text-gray-300">Đơn hàng hôm nay</span>
                        <span className="text-blue-400 font-semibold">24 đơn</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <span className="text-gray-300">User mới tuần này</span>
                        <span className="text-purple-400 font-semibold">12 người</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;