import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Users, ShoppingBag, TrendingUp, Package, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

interface Order {
    id: number;
    order_code: string;
    user_id: string;
    amount: string;
    description: string;
    items: any[];
    payment_method: string;
    payment_status: string;
    paid: boolean;
    paid_at: string;
    shipping_address: string;
    shipping_fee: string;
    created_at: string;
    updated_at: string;
}

interface Stats {
    totalFoods: number;
    totalUsers: number;
    totalOrders: number;
    revenue: number;
}

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>({
        totalFoods: 0,
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0
    });
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPaidOrders();
    }, [currentPage]);

    const fetchPaidOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/payment/orders/paid/all`, {
                params: {
                    page: currentPage,
                    limit: 20
                }
            });

            if (response.data.success) {
                const ordersData = response.data.data;
                setOrders(ordersData);
                setTotalPages(response.data.pagination.totalPages);

                // Tính tổng doanh thu từ tất cả đơn hàng đã thanh toán
                const totalRevenue = ordersData.reduce((sum: number, order: Order) => {
                    return sum + parseFloat(order.amount);
                }, 0);

                setStats({
                    totalFoods: 0, // TODO: Thêm API đếm foods
                    totalUsers: 0, // TODO: Thêm API đếm users
                    totalOrders: response.data.pagination.total,
                    revenue: totalRevenue
                });
            }
        } catch (error) {
            console.error('Error fetching paid orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number | string) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numAmount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            title: 'Đơn hàng đã thanh toán',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-400'
        },
        {
            title: 'Tổng doanh thu',
            value: formatCurrency(stats.revenue),
            icon: TrendingUp,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-400'
        }
    ];

    if (loading && orders.length === 0) {
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

            {/* Orders List */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Đơn hàng đã thanh toán</h3>
                    <span className="text-sm text-gray-400">
                        Trang {currentPage} / {totalPages}
                    </span>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                        <p className="text-gray-400">Chưa có đơn hàng nào</p>
                    </div>
                ) : (
                    <div
                        className="space-y-4 overflow-y-auto cart-scroll pr-2"
                        style={{ maxHeight: "calc(100vh - 500px)" }}
                    >
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-emerald-400 font-semibold">
                                                #{order.order_code}
                                            </span>
                                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                                {order.payment_status}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>{formatDate(order.paid_at || order.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Package size={14} />
                                                <span>{order.items?.length || 0} món</span>
                                            </div>
                                        </div>

                                        {order.description && (
                                            <p className="text-sm text-gray-500">{order.description}</p>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white mb-1">
                                            {formatCurrency(order.amount)}
                                        </div>
                                        {parseFloat(order.shipping_fee) > 0 && (
                                            <div className="text-xs text-gray-400">
                                                Phí ship: {formatCurrency(order.shipping_fee)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-300"
                                                >
                                                    {item.name || item.food?.name} x{item.quantity}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                        >
                            Trước
                        </button>
                        <span className="px-4 py-2 text-gray-400">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;