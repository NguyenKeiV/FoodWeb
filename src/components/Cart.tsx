import React, { useState, useEffect } from "react";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    Loader2,
    ShoppingBag,
    ArrowLeft,
    MapPin,
    Truck,
    ChevronDown,
    CreditCard,
} from "lucide-react";

interface CartItem {
    id: number;
    user_id: string;
    food_id: number;
    quantity: number;
    price_at_add: string;
    created_at: string;
    updated_at: string;
    food: {
        id: number;
        name: string;
        img: string;
        price: string;
        quantity: number;
        category: string;
    };
}

interface Ward {
    name: string;
    code: number;
    codename: string;
    division_type: string;
    short_codename: string;
}

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || "https://foodweb-be.onrender.com/api";

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingItem, setUpdatingItem] = useState<number | null>(null);
    const [deletingItem, setDeletingItem] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState(0);

    // Shipping states
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedWard, setSelectedWard] = useState("");
    const [shippingFee, setShippingFee] = useState<number>(0);
    const [loadingWards, setLoadingWards] = useState(false);
    const [calculatingShipping, setCalculatingShipping] = useState(false);
    const [shippingError, setShippingError] = useState("");

    // Payment states
    const [processingPayment, setProcessingPayment] = useState(false);

    const getUserId = (): string | null => {
        const user = localStorage.getItem("user");
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

    const fetchCart = async () => {
        const userId = getUserId();


        if (!userId) {
            window.location.href = '/login';
            return;
        }

        try {
            setLoading(true);
            setError("");

            const url = `${API_BASE_URL}/carts/${userId}`;

            const response = await fetch(url);

            const data = await response.json();

            if (data.success) {
                setCartItems(data.data || []);
                setTotalPrice(data.total || 0);
            } else {
                setError(data.error || "Không thể tải giỏ hàng");
                console.error('❌ Cart error:', data.error);
            }
        } catch (err) {
            console.error("❌ Error fetching cart:", err);
            setError("Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    const fetchWards = async () => {
        try {
            setLoadingWards(true);
            const response = await fetch("https://provinces.open-api.vn/api/d/769/?depth=2");
            const data = await response.json();

            if (data.wards) {
                setWards(data.wards);
            }
        } catch (err) {
            console.error("Error fetching wards:", err);
            setShippingError("Không thể tải danh sách phường");
        } finally {
            setLoadingWards(false);
        }
    };

    const calculateShippingFee = async (wardName: string) => {
        if (!wardName) {
            setShippingError("Vui lòng chọn phường giao hàng");
            return;
        }

        try {
            setCalculatingShipping(true);
            setShippingError("");

            const response = await fetch(`${API_BASE_URL}/shipping/fee`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ wardName }),
            });

            const data = await response.json();

            if (data.success) {
                setShippingFee(data.shippingFee);

                if (data.isDefaultFee) {
                    setShippingError(`Áp dụng phí mặc định cho ${data.normalizedWard}`);
                }
            } else {
                setShippingError("Không thể tính phí vận chuyển");
            }
        } catch (err) {
            console.error("Error calculating shipping:", err);
            setShippingError("Không thể tính phí vận chuyển. Vui lòng thử lại");
        } finally {
            setCalculatingShipping(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedWard || shippingFee === 0) {
            alert("Vui lòng chọn phường và tính phí vận chuyển");
            return;
        }

        const userId = getUserId();
        if (!userId) {
            window.location.href = '/login';
            return;
        }

        try {
            setProcessingPayment(true);

            const totalAmount = getTotalAmount();

            const orderItems = cartItems.map((item) => ({
                name: item.food.name,
                quantity: item.quantity,
                price: Number(item.price_at_add),
                price_at_add: Number(item.price_at_add),
            }));

            const response = await fetch(`${API_BASE_URL}/payment/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    amount: totalAmount,
                    description: `Đơn hàng - ${cartItems.length} món - Giao đến ${selectedWard}`,
                    items: orderItems,
                    shippingAddress: selectedWard,
                    shippingFee: shippingFee,
                }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('pendingOrder', JSON.stringify({
                    amount: totalAmount,
                    shippingAddress: selectedWard,
                    shippingFee,
                    items: orderItems,
                }));

                window.location.href = data.data.paymentUrl;
            } else {
                alert(data.message || "Không thể tạo link thanh toán");
            }
        } catch (err) {
            console.error("Payment error:", err);
            alert("Không thể kết nối đến server thanh toán");
        } finally {
            setProcessingPayment(false);
        }
    };

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        const userId = getUserId();
        if (!userId) return;

        if (newQuantity < 1) {
            removeItem(itemId);
            return;
        }

        try {
            setUpdatingItem(itemId);

            const response = await fetch(
                `${API_BASE_URL}/carts/${userId}/items/${itemId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ quantity: newQuantity }),
                }
            );

            const data = await response.json();

            if (data.success) {
                await fetchCart();
            } else {
                alert(data.error || "Không thể cập nhật số lượng");
            }
        } catch (err) {
            console.error("Error updating quantity:", err);
            alert("Không thể cập nhật số lượng");
        } finally {
            setUpdatingItem(null);
        }
    };

    // ✅ FIXED: Remove single item
    const removeItem = async (itemId: number) => {
        const userId = getUserId();


        if (!userId) {
            console.error('❌ No userId found');
            alert("Vui lòng đăng nhập lại");
            return;
        }

        if (!confirm("Bạn có chắc muốn xóa món này khỏi giỏ hàng?")) {
            return;
        }

        try {
            setDeletingItem(itemId);

            // ✅ FIXED: Use correct endpoint with /items/:id
            const url = `${API_BASE_URL}/carts/${userId}/items/${itemId}`;

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });


            const data = await response.json();

            if (data.success) {
                await fetchCart(); // Refresh cart
            } else {
                console.error('❌ Remove item failed:', data.error || data.message);
                alert(data.error || data.message || "Không thể xóa món");
            }
        } catch (err: any) {
            console.error("❌ Error removing item:", err);
            alert("Không thể xóa món. Vui lòng thử lại");
        } finally {
            setDeletingItem(null);
        }
    };

    // ✅ FIXED: Clear entire cart
    const clearCart = async () => {
        const userId = getUserId();


        if (!userId) {
            console.error('❌ No userId found');
            alert("Vui lòng đăng nhập lại");
            return;
        }

        if (!confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
            return;
        }

        try {
            setLoading(true);

            // ✅ FIXED: Use /clear endpoint to avoid conflict
            const url = `${API_BASE_URL}/carts/${userId}/clear`;

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });


            const data = await response.json();

            if (data.success) {

                // Update UI immediately
                setCartItems([]);
                setTotalPrice(0);
                setShippingFee(0);
                setSelectedWard("");

                alert(`Đã xóa ${data.data?.deletedCount || 0} món khỏi giỏ hàng`);
            } else {
                console.error('❌ Clear cart failed:', data.error);
                alert(data.error || "Không thể xóa giỏ hàng");
            }
        } catch (err: any) {
            console.error("❌ Error clearing cart:", err);
            alert("Không thể xóa giỏ hàng. Vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {

        fetchCart();
        fetchWards();
    }, []);

    const formatPrice = (price: number | string): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(Number(price));
    };

    const getImageUrl = (img: string | null): string => {
        if (!img) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop";
        if (img.startsWith("http")) return img;
        return `https://foodweb-be.onrender.com${img}`;
    };

    const getItemTotal = (item: CartItem): number => {
        return Number(item.price_at_add) * item.quantity;
    };

    const getTotalAmount = (): number => {
        return totalPrice + shippingFee;
    };

    if (loading) {
        return (
            <div className="w-full max-w-6xl mx-auto p-6">
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <Loader2 className="animate-spin text-white" size={48} />
                    <p className="text-white text-lg">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-6xl mx-auto p-6">
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                        onClick={fetchCart}
                        className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6 h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                    >
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                            <ShoppingCart size={40} />
                            Giỏ hàng
                        </h1>
                        <p className="text-emerald-100 mt-2">
                            {cartItems.length} món trong giỏ
                        </p>
                    </div>
                </div>

                {cartItems.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="px-6 py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all font-semibold border border-red-500/50"
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            {/* Empty Cart */}
            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-6">
                    <ShoppingBag className="text-white/40" size={120} />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Giỏ hàng trống
                        </h2>
                        <p className="text-emerald-100 mb-6">
                            Hãy thêm món ăn vào giỏ hàng nhé!
                        </p>
                        <button
                            onClick={goBack}
                            className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                    {/* Cart Items */}
                    <div
                        className="lg:col-span-2 overflow-y-auto pr-3 space-y-4 cart-scroll"
                        style={{ maxHeight: "calc(100vh - 330px)" }}
                    >
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all"
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={getImageUrl(item.food.img)}
                                        alt={item.food.name}
                                        className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop";
                                        }}
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1 min-w-0 mr-2">
                                                <h3 className="text-xl font-semibold text-white truncate">
                                                    {item.food.name}
                                                </h3>
                                                <p className="text-emerald-200 text-sm">
                                                    {formatPrice(item.price_at_add)} × {item.quantity}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeItem(item.id);
                                                }}
                                                disabled={deletingItem === item.id}
                                                className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 flex-shrink-0"
                                                title="Xóa món này"
                                            >
                                                {deletingItem === item.id ? (
                                                    <Loader2 className="animate-spin" size={20} />
                                                ) : (
                                                    <Trash2 size={20} />
                                                )}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={updatingItem === item.id || item.quantity <= 1}
                                                    className="p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50"
                                                >
                                                    <Minus className="text-white" size={16} />
                                                </button>

                                                <span className="text-white font-semibold w-8 text-center">
                                                    {updatingItem === item.id ? (
                                                        <Loader2 className="animate-spin mx-auto" size={16} />
                                                    ) : (
                                                        item.quantity
                                                    )}
                                                </span>

                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updatingItem === item.id || item.quantity >= item.food.quantity}
                                                    className="p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50"
                                                >
                                                    <Plus className="text-white" size={16} />
                                                </button>
                                            </div>

                                            <div className="text-xl font-bold text-emerald-300">
                                                {formatPrice(getItemTotal(item))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary & Shipping */}
                    <div className="lg:col-span-1 overflow-y-auto">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-0 space-y-6">
                            {/* Ward Selection */}
                            <div>
                                <label className="flex items-center gap-2 text-white font-semibold mb-3">
                                    <MapPin size={20} />
                                    Chọn phường giao hàng
                                </label>

                                <div className="relative">
                                    <select
                                        value={selectedWard}
                                        onChange={(e) => {
                                            setSelectedWard(e.target.value);
                                            setShippingFee(0);
                                            setShippingError("");
                                        }}
                                        disabled={loadingWards}
                                        className="w-full appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" className="bg-gray-800">
                                            -- Chọn phường --
                                        </option>
                                        {wards.map((ward) => (
                                            <option key={ward.code} value={ward.name} className="bg-gray-800">
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={20} />
                                </div>

                                {loadingWards && (
                                    <p className="text-yellow-300 text-xs mt-2 flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={14} />
                                        Đang tải danh sách phường...
                                    </p>
                                )}

                                {shippingError && (
                                    <p className="text-yellow-300 text-sm mt-2">{shippingError}</p>
                                )}

                                <button
                                    onClick={() => calculateShippingFee(selectedWard)}
                                    disabled={calculatingShipping || !selectedWard}
                                    className="w-full mt-3 px-4 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition-all font-semibold border border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {calculatingShipping ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Đang tính...
                                        </>
                                    ) : (
                                        <>
                                            <Truck size={20} />
                                            Tính phí vận chuyển
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    Tóm tắt đơn hàng
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-emerald-100">
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-100">
                                        <span>Phí vận chuyển</span>
                                        <span className={shippingFee > 0 ? "text-emerald-300 font-semibold" : ""}>
                                            {shippingFee > 0 ? formatPrice(shippingFee) : "Chưa tính"}
                                        </span>
                                    </div>
                                    <div className="border-t border-white/20 pt-3 flex justify-between text-xl font-bold text-white">
                                        <span>Tổng cộng</span>
                                        <span className="text-emerald-300">
                                            {formatPrice(getTotalAmount())}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={!selectedWard || shippingFee === 0 || processingPayment}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    {processingPayment ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={24} />
                                            {shippingFee > 0 ? "Thanh toán" : "Vui lòng chọn phường"}
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={goBack}
                                    className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
                                >
                                    Tiếp tục mua sắm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;