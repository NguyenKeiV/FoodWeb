import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Users, ShoppingBag, TrendingUp, Package, Calendar, Download } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

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

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'https://foodweb-be.onrender.com/api';

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
        fetchAllData();
    }, [currentPage]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // ✅ Fetch tất cả data song song
            const [ordersRes, usersRes, foodsRes] = await Promise.all([
                // 1. Fetch orders (đã có)
                axios.get(`${API_BASE_URL}/payment/orders/paid/all`, {
                    params: { page: currentPage, limit: 20 }
                }),

                // 2. Fetch users count
                axios.get(`${API_BASE_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { page: 1, limit: 1 } // Chỉ cần count
                }),

                // 3. Fetch foods count
                axios.get(`${API_BASE_URL}/foods`, {
                    params: { page: 1, limit: 1 } // Chỉ cần count
                })
            ]);

            // Process orders
            if (ordersRes.data.success) {
                const ordersData = ordersRes.data.data;
                setOrders(ordersData);
                setTotalPages(ordersRes.data.pagination.totalPages);

                // Tính tổng doanh thu
                const totalRevenue = ordersData.reduce((sum: number, order: Order) => {
                    return sum + parseFloat(order.amount);
                }, 0);

                // ✅ Cập nhật stats với data thực
                setStats({
                    totalFoods: foodsRes.data.pagination?.total || 0,
                    totalUsers: usersRes.data.pagination?.total || 0,
                    totalOrders: ordersRes.data.pagination.total,
                    revenue: totalRevenue
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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

    // ✅ Export to Excel function
    const exportToExcel = () => {
        try {
            // Prepare data for export
            const exportData = orders.map((order, index) => {
                const itemsDetail = order.items?.map((item: any) =>
                    `${item.name || item.food?.name} (SL: ${item.quantity}, Giá: ${formatCurrency(item.price * item.quantity)})`
                ).join('; ') || '';

                return {
                    'STT': index + 1,
                    'Mã đơn hàng': order.order_code,
                    'User ID': order.user_id,
                    'Địa chỉ giao hàng': order.shipping_address || '',
                    'Số món': order.items?.length || 0,
                    'Chi tiết món ăn': itemsDetail,
                    'Tạm tính': parseFloat(order.amount).toLocaleString('vi-VN') + ' ₫',
                    'Phí vận chuyển': parseFloat(order.shipping_fee).toLocaleString('vi-VN') + ' ₫',
                    'Tổng tiền': (parseFloat(order.amount) + parseFloat(order.shipping_fee || '0')).toLocaleString('vi-VN') + ' ₫',
                    'Phương thức thanh toán': order.payment_method,
                    'Trạng thái': order.payment_status,
                    'Ngày thanh toán': formatDate(order.paid_at || order.created_at),
                    'Ghi chú': order.description || ''
                };
            });

            // Create workbook and worksheet
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Đơn hàng');

            // Set column widths
            const columnWidths = [
                { wch: 5 },   // STT
                { wch: 15 },  // Mã đơn hàng
                { wch: 30 },  // User ID
                { wch: 35 },  // Địa chỉ
                { wch: 10 },  // Số món
                { wch: 50 },  // Chi tiết món
                { wch: 15 },  // Tạm tính
                { wch: 15 },  // Phí ship
                { wch: 15 },  // Tổng tiền
                { wch: 15 },  // PT thanh toán
                { wch: 12 },  // Trạng thái
                { wch: 18 },  // Ngày TT
                { wch: 20 }   // Ghi chú
            ];
            worksheet['!cols'] = columnWidths;

            // Generate filename with current date
            const fileName = `DonHang_Trang${currentPage}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`;

            // Export file
            XLSX.writeFile(workbook, fileName);

            alert(`✅ Đã xuất ${orders.length} đơn hàng ra file Excel!`);
        } catch (error) {
            console.error('Export error:', error);
            alert('❌ Không thể xuất file Excel. Vui lòng thử lại!');
        }
    };

    // ✅ Export ALL orders (fetch all pages)
    const exportAllOrders = async () => {
        try {
            if (!confirm(`Bạn có chắc muốn xuất TẤT CẢ ${stats.totalOrders} đơn hàng ra Excel? Quá trình này có thể mất vài giây.`)) {
                return;
            }

            setLoading(true);

            // Fetch all orders at once
            const response = await axios.get(`${API_BASE_URL}/payment/orders/paid/all`, {
                params: { page: 1, limit: stats.totalOrders } // Lấy tất cả
            });

            if (!response.data.success) {
                throw new Error('Không thể lấy dữ liệu');
            }

            const allOrders = response.data.data;

            // Prepare data
            const exportData = allOrders.map((order: Order, index: number) => {
                const itemsDetail = order.items?.map((item: any) =>
                    `${item.name || item.food?.name} (SL: ${item.quantity}, Giá: ${formatCurrency(item.price * item.quantity)})`
                ).join('; ') || '';

                return {
                    'STT': index + 1,
                    'Mã đơn hàng': order.order_code,
                    'User ID': order.user_id,
                    'Địa chỉ giao hàng': order.shipping_address || '',
                    'Số món': order.items?.length || 0,
                    'Chi tiết món ăn': itemsDetail,
                    'Tạm tính': parseFloat(order.amount).toLocaleString('vi-VN') + ' ₫',
                    'Phí vận chuyển': parseFloat(order.shipping_fee).toLocaleString('vi-VN') + ' ₫',
                    'Tổng tiền': (parseFloat(order.amount) + parseFloat(order.shipping_fee || '0')).toLocaleString('vi-VN') + ' ₫',
                    'Phương thức thanh toán': order.payment_method,
                    'Trạng thái': order.payment_status,
                    'Ngày thanh toán': formatDate(order.paid_at || order.created_at),
                    'Ghi chú': order.description || ''
                };
            });

            // Create workbook
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tất cả đơn hàng');

            // Set column widths
            const columnWidths = [
                { wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 35 }, { wch: 10 },
                { wch: 50 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
                { wch: 12 }, { wch: 18 }, { wch: 20 }
            ];
            worksheet['!cols'] = columnWidths;

            // Export
            const fileName = `TatCaDonHang_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            alert(`✅ Đã xuất TẤT CẢ ${allOrders.length} đơn hàng ra file Excel!`);
        } catch (error) {
            console.error('Export all error:', error);
            alert('❌ Không thể xuất file Excel. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
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
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-white">Đơn hàng đã thanh toán</h3>

                        {/* Export Buttons */}
                        <button
                            onClick={exportToExcel}
                            disabled={loading || orders.length === 0}
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/50"
                            title="Xuất trang hiện tại"
                        >
                            <Download size={16} />
                            <span className="text-sm">Trang này</span>
                        </button>

                        <button
                            onClick={exportAllOrders}
                            disabled={loading || stats.totalOrders === 0}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/50"
                            title="Xuất tất cả đơn hàng"
                        >
                            <Download size={16} />
                            <span className="text-sm">Tất cả ({stats.totalOrders})</span>
                        </button>
                    </div>

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
                        style={{ maxHeight: "calc(100vh - 465px)" }}
                    >
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
                            >
                                {/* Header Row */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-emerald-400 font-bold text-lg">
                                                #{order.order_code}
                                            </span>
                                            <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                                                Đã thanh toán
                                            </span>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users size={16} className="text-blue-400" />
                                            <span className="text-white font-medium">
                                                Khách hàng:
                                                <span className="text-blue-400 ml-2">User ID: {order.user_id.substring(0, 8)}...</span>
                                            </span>
                                        </div>

                                        {/* Shipping Address */}
                                        {order.shipping_address && (
                                            <div className="flex items-start gap-2 mb-2">
                                                <svg className="w-4 h-4 text-orange-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div className="flex-1">
                                                    <span className="text-gray-400 text-sm">Địa chỉ giao hàng:</span>
                                                    <p className="text-white font-medium">{order.shipping_address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Date & Items Count */}
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>{formatDate(order.paid_at || order.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Package size={14} />
                                                <span>{order.items?.length || 0} món</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Section */}
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white mb-1">
                                            {formatCurrency(order.amount)}
                                        </div>
                                        {parseFloat(order.shipping_fee) > 0 && (
                                            <div className="text-xs text-gray-400">
                                                Phí ship: {formatCurrency(order.shipping_fee)}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 mt-1">
                                            Tổng: {formatCurrency(parseFloat(order.amount) + parseFloat(order.shipping_fee || '0'))}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                {order.items && order.items.length > 0 && (
                                    <div className="pt-3 border-t border-white/5">
                                        <div className="text-gray-400 text-xs mb-2 font-semibold">Chi tiết đơn hàng:</div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {order.items.map((item: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="px-3 py-2 bg-white/5 rounded-lg text-sm"
                                                >
                                                    <div className="text-white font-medium">
                                                        {item.name || item.food?.name}
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-gray-400 text-xs">SL: {item.quantity}</span>
                                                        <span className="text-emerald-400 text-xs font-semibold">
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Payment Method */}
                                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <span className="text-gray-400">Thanh toán qua:</span>
                                        <span className="text-purple-400 font-semibold">{order.payment_method}</span>
                                    </div>
                                    {order.description && (
                                        <div className="text-xs text-gray-500 italic">
                                            {order.description}
                                        </div>
                                    )}
                                </div>
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