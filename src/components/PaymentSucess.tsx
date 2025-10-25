import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Home, ShoppingBag } from "lucide-react";

interface PaymentStatus {
    orderCode: string;
    status: string;
    amount: number;
    paid: boolean;
    paidAt?: string;
    userId?: string;
}

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || "https://foodweb-be.onrender.com/api";

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");

    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(5); // Countdown timer

    useEffect(() => {
        if (!orderCode) {
            setError("Không tìm thấy mã đơn hàng");
            setLoading(false);
            return;
        }

        checkPaymentStatus();
    }, [orderCode]);

    // ✅ Auto redirect countdown - FIXED VERSION
    useEffect(() => {
        if (!paymentStatus) return;

        console.log("🔄 Payment status:", paymentStatus.status, "Paid:", paymentStatus.paid);

        // ✅ Nếu PAID → Redirect về trang chủ sau 5s
        if (paymentStatus.status === "PAID" || paymentStatus.paid) {
            console.log("✅ Payment successful, starting countdown...");

            let currentCount = 5;
            setCountdown(currentCount);

            const timer = setInterval(() => {
                currentCount -= 1;
                console.log(`⏱️  Countdown: ${currentCount}`);

                setCountdown(currentCount);

                if (currentCount <= 0) {
                    clearInterval(timer);
                    console.log("🚀 Redirecting to home...");
                    // ✅ Clear pending order trước khi redirect
                    localStorage.removeItem('pendingOrder');
                    window.location.href = "/"; // ✅ Force redirect
                }
            }, 1000);

            return () => {
                console.log("🧹 Cleanup timer");
                clearInterval(timer);
            };
        }

        // ✅ Nếu CANCELLED hoặc FAILED → Redirect về cart sau 5s
        if (paymentStatus.status === "CANCELLED" || paymentStatus.status === "FAILED") {
            console.log("❌ Payment failed/cancelled, starting countdown...");

            let currentCount = 5;
            setCountdown(currentCount);

            const timer = setInterval(() => {
                currentCount -= 1;
                console.log(`⏱️  Countdown: ${currentCount}`);

                setCountdown(currentCount);

                if (currentCount <= 0) {
                    clearInterval(timer);
                    console.log("🚀 Redirecting to cart...");
                    // ✅ Redirect về cart với query param
                    window.location.href = "/cart?fromPayment=failed"; // ✅ Force redirect
                }
            }, 1000);

            return () => {
                console.log("🧹 Cleanup timer");
                clearInterval(timer);
            };
        }
    }, [paymentStatus]);

    const checkPaymentStatus = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_BASE_URL}/payment/status/${orderCode}`);
            const data = await response.json();

            if (data.success) {
                setPaymentStatus(data.data);

                // ✅ NẾU THANH TOÁN THÀNH CÔNG → XÓA PENDING ORDER TRONG LOCALSTORAGE
                if (data.data.status === "PAID" || data.data.paid) {
                    console.log("✅ Payment successful - Clearing pending order from localStorage");
                    localStorage.removeItem('pendingOrder');

                    // ✅ Optional: Clear cart cache nếu có
                    // Điều này giúp Cart.tsx tự động fetch lại từ server
                    console.log("✅ Cart will be refreshed on next visit");
                }
            } else {
                setError(data.message || "Không thể kiểm tra trạng thái thanh toán");
            }
        } catch (err) {
            console.error("Error checking payment status:", err);
            setError("Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString("vi-VN");
    };

    const handleGoHomeNow = () => {
        console.log("🏠 Manual redirect to home");
        // ✅ Clear pending order trước khi redirect
        localStorage.removeItem('pendingOrder');
        window.location.href = "/";
    };

    const handleGoToCartNow = () => {
        console.log("🛒 Manual redirect to cart");
        // ✅ Thêm query param để Cart biết vừa thanh toán xong
        window.location.href = "/cart?fromPayment=success";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center p-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center">
                    <Loader2 className="animate-spin text-white mx-auto mb-4" size={64} />
                    <p className="text-white text-xl font-semibold">Đang kiểm tra trạng thái thanh toán...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 flex items-center justify-center p-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center max-w-md">
                    <XCircle className="text-white mx-auto mb-6" size={80} />
                    <h1 className="text-3xl font-bold text-white mb-4">Có lỗi xảy ra</h1>
                    <p className="text-white/90 text-lg mb-8">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleGoHomeNow}
                            className="px-6 py-3 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center gap-2"
                        >
                            <Home size={20} />
                            Về trang chủ
                        </button>
                        <button
                            onClick={checkPaymentStatus}
                            className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Thanh toán thành công
    if (paymentStatus?.status === "PAID" || paymentStatus?.paid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center p-6">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center max-w-2xl w-full">
                    <div className="mb-8">
                        <CheckCircle className="text-white mx-auto mb-6 animate-bounce" size={100} />
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Thanh toán thành công! 🎉
                        </h1>
                        <p className="text-white/90 text-lg mb-4">
                            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
                        </p>
                        <p className="text-emerald-200 text-sm">
                            Giỏ hàng của bạn đã được xóa tự động.
                        </p>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-6 mb-8 text-left">
                        <h2 className="text-xl font-semibold text-white mb-4">Thông tin đơn hàng</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-white/90">
                                <span>Mã đơn hàng:</span>
                                <span className="font-semibold">#{paymentStatus.orderCode}</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                                <span>Số tiền:</span>
                                <span className="font-semibold text-emerald-300">
                                    {formatPrice(paymentStatus.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between text-white/90">
                                <span>Trạng thái:</span>
                                <span className="font-semibold text-green-300">Đã thanh toán</span>
                            </div>
                            {paymentStatus.paidAt && (
                                <div className="flex justify-between text-white/90">
                                    <span>Thời gian:</span>
                                    <span className="font-semibold">{formatDate(paymentStatus.paidAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ✅ Countdown Timer */}
                    <div className="mb-6 text-white/80 text-sm">
                        Tự động chuyển về trang chủ sau <span className="font-bold text-white text-lg">{countdown}</span> giây...
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleGoHomeNow}
                            className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                            <Home size={24} />
                            Về trang chủ ngay
                        </button>
                        <button
                            onClick={() => navigate("/orders")}
                            className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all flex items-center gap-2"
                        >
                            <ShoppingBag size={24} />
                            Xem đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Thanh toán thất bại hoặc đang chờ
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 flex items-center justify-center p-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 text-center max-w-2xl w-full">
                <div className="mb-8">
                    <XCircle className="text-white mx-auto mb-6" size={100} />
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Thanh toán chưa hoàn tất
                    </h1>
                    <p className="text-white/90 text-lg mb-4">
                        {paymentStatus?.status === "CANCELLED"
                            ? "Giao dịch đã bị hủy."
                            : paymentStatus?.status === "FAILED"
                                ? "Giao dịch thất bại."
                                : "Giao dịch đang được xử lý. Vui lòng kiểm tra lại sau."}
                    </p>
                    <p className="text-orange-200 text-sm">
                        Giỏ hàng của bạn vẫn được giữ nguyên.
                    </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-6 mb-8 text-left">
                    <h2 className="text-xl font-semibold text-white mb-4">Thông tin đơn hàng</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-white/90">
                            <span>Mã đơn hàng:</span>
                            <span className="font-semibold">#{paymentStatus?.orderCode}</span>
                        </div>
                        <div className="flex justify-between text-white/90">
                            <span>Số tiền:</span>
                            <span className="font-semibold">{formatPrice(paymentStatus?.amount || 0)}</span>
                        </div>
                        <div className="flex justify-between text-white/90">
                            <span>Trạng thái:</span>
                            <span className="font-semibold text-yellow-300">
                                {paymentStatus?.status || "Đang xử lý"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ✅ Countdown Timer for failed payments */}
                {(paymentStatus?.status === "CANCELLED" || paymentStatus?.status === "FAILED") && (
                    <div className="mb-6 text-white/80 text-sm">
                        Tự động chuyển về giỏ hàng sau <span className="font-bold text-white text-lg">{countdown}</span> giây...
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleGoToCartNow}
                        className="px-8 py-4 bg-white text-orange-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                        <ShoppingBag size={24} />
                        Về giỏ hàng
                    </button>
                    <button
                        onClick={checkPaymentStatus}
                        className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
                    >
                        Kiểm tra lại
                    </button>
                    <button
                        onClick={handleGoHomeNow}
                        className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        <Home size={24} />
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;