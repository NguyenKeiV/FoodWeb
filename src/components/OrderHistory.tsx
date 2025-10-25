import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    order_code: string;
    amount: string;
    description: string;
    items: OrderItem[];
    payment_method: string;
    payment_status: 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED';
    paid: boolean;
    paid_at: string | null;
    shipping_address: string | null;
    shipping_fee: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    error?: string;
    data: Order[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'https://foodweb-be.onrender.com/api';

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const getUserId = (): string | null => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                return userData.id;
            } catch {
                return null;
            }
        }
        return null;
    };

    const fetchOrders = async (page: number = 1) => {
        const userId = getUserId();

        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch(`${API_BASE_URL}/payment/orders/${userId}?page=${page}&limit=10`);
            const data: ApiResponse = await response.json();

            console.log('📦 Orders fetched:', data);

            if (data.success) {
                setOrders(data.data);
                setCurrentPage(data.pagination.page);
                setTotalPages(data.pagination.totalPages);
                setTotalOrders(data.pagination.total);
            } else {
                setError(data.error || 'Không thể tải lịch sử đơn hàng');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const toggleOrderExpand = (orderId: number) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const formatPrice = (price: number | string): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(Number(price));
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            PAID: {
                color: 'bg-green-500/20 text-green-300 border-green-500/50',
                icon: '✓',
                text: 'Đã thanh toán',
            },
            PENDING: {
                color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
                icon: '⏱',
                text: 'Chờ thanh toán',
            },
            CANCELLED: {
                color: 'bg-red-500/20 text-red-300 border-red-500/50',
                icon: '✕',
                text: 'Đã hủy',
            },
            FAILED: {
                color: 'bg-red-500/20 text-red-300 border-red-500/50',
                icon: '!',
                text: 'Thất bại',
            },
        };
        return configs[status as keyof typeof configs] || configs.PENDING;
    };

    if (loading) {
        return (
            <div className="w-full max-w-6xl mx-auto p-6 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white text-lg">Đang tải lịch sử đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto p-6 min-h-screen flex items-center justify-center">
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center max-w-md">
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => fetchOrders(currentPage)}
                        className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6 min-h-screen overflow-y-auto cart-scroll">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Lịch sử đơn hàng
                        </h1>
                        <p className="text-emerald-100 mt-2">{totalOrders} đơn hàng</p>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <svg className="w-32 h-32 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Chưa có đơn hàng nào</h2>
                        <p className="text-emerald-100 mb-6">Hãy mua sắm và tạo đơn hàng đầu tiên nhé!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Orders List */}
                    <div className="space-y-4 mb-8">
                        {orders.map((order) => {
                            const isExpanded = expandedOrders.has(order.id);
                            const statusConfig = getStatusConfig(order.payment_status);
                            const subtotal = Number(order.amount) - Number(order.shipping_fee);

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all"
                                >
                                    {/* Order Header */}
                                    <div
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleOrderExpand(order.id)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                    <h3 className="text-xl font-semibold text-white">
                                                        Đơn hàng #{order.order_code}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${statusConfig.color}`}>
                                                        <span>{statusConfig.icon}</span>
                                                        {statusConfig.text}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-emerald-100 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{formatDate(order.created_at)}</span>
                                                    </div>

                                                    {order.shipping_address && (
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="truncate">{order.shipping_address}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        <span>{order.payment_method}</span>
                                                    </div>

                                                    {order.paid_at && (
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>TT: {formatDate(order.paid_at)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <div className="text-2xl font-bold text-emerald-300 mb-2">
                                                    {formatPrice(order.amount)}
                                                </div>
                                                <button className="text-white/60 hover:text-white transition-all">
                                                    {isExpanded ? (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details (Expanded) */}
                                    {isExpanded && (
                                        <div className="border-t border-white/20 p-6 bg-white/5">
                                            <div className="space-y-4">
                                                {/* Items List */}
                                                <div>
                                                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                        Chi tiết đơn hàng
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {order.items.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex justify-between items-center bg-white/5 rounded-lg p-3"
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="text-white font-medium">{item.name}</p>
                                                                    <p className="text-emerald-200 text-sm">Số lượng: {item.quantity}</p>
                                                                </div>
                                                                <div className="text-emerald-300 font-semibold">
                                                                    {formatPrice(item.price * item.quantity)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Price Breakdown */}
                                                <div className="border-t border-white/20 pt-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-emerald-100">
                                                            <span>Tạm tính</span>
                                                            <span>{formatPrice(subtotal)}</span>
                                                        </div>
                                                        {Number(order.shipping_fee) > 0 && (
                                                            <div className="flex justify-between text-emerald-100">
                                                                <span className="flex items-center gap-2">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                                                    </svg>
                                                                    Phí vận chuyển
                                                                </span>
                                                                <span>{formatPrice(order.shipping_fee)}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/20">
                                                            <span>Tổng cộng</span>
                                                            <span className="text-emerald-300">{formatPrice(order.amount)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Info */}
                                                {order.description && (
                                                    <div className="bg-white/5 rounded-lg p-3">
                                                        <p className="text-emerald-100 text-sm">
                                                            <strong>Ghi chú:</strong> {order.description}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Trước
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === pageNum
                                                ? 'bg-white text-emerald-700'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default OrderHistory;