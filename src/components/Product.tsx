import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  UtensilsCrossed,
  Coffee,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

// Type definitions
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    offset: number;
  };
}

type Category = "food" | "drink";

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'https://foodweb-be.onrender.com/api';

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("food");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Get userId from localStorage - IMPROVED VERSION
  const getUserId = (): string | null => {
    try {
      const user = localStorage.getItem('user');

      console.log('🔍 LocalStorage user:', user);

      if (!user) {
        console.error('❌ No user found in localStorage');
        return null;
      }

      const userData = JSON.parse(user);
      console.log('🔍 Parsed user data:', userData);

      const userId = userData.id || userData.user_id || userData.userId;
      console.log('🔍 Extracted userId:', userId);

      if (!userId) {
        console.error('❌ No userId field found in user data');
        console.log('Available fields:', Object.keys(userData));
        return null;
      }

      return userId;
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      return null;
    }
  };

  // Fetch products from API
  const fetchProducts = async (category: Category) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/foods/category/${category}?limit=20`);
      const data: ApiResponse<Product[]> = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || data.message || "Không thể tải sản phẩm");
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể kết nối đến server");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart API call - IMPROVED WITH BETTER ERROR HANDLING
  const addToCart = async (productId: number, productName: string) => {
    const userId = getUserId();

    if (!userId) {
      setDebugInfo("❌ Không tìm thấy userId. Vui lòng đăng nhập lại!");
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    try {
      setAddingToCart(productId);
      setDebugInfo("");

      // Log request details
      const requestBody = {
        food_id: productId,
        quantity: 1,
      };

      console.log('📤 Request Details:', {
        url: `${API_BASE_URL}/carts/${userId}`,
        method: 'POST',
        body: requestBody,
        userId: userId,
        foodId: productId
      });

      const response = await fetch(`${API_BASE_URL}/carts/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (data.success) {
        // Show success state
        setAddedToCart(productId);
        setDebugInfo(`✅ Đã thêm "${productName}" vào giỏ hàng!`);

        // Reset success state after 2 seconds
        setTimeout(() => {
          setAddedToCart(null);
          setDebugInfo("");
        }, 2000);
      } else {
        const errorMsg = data.error || data.message || "Không thể thêm vào giỏ hàng";
        console.error('❌ API Error:', errorMsg);
        setDebugInfo(`❌ Lỗi: ${errorMsg}`);
        alert(errorMsg);
      }
    } catch (err: any) {
      console.error("❌ Error adding to cart:", err);
      const errorMsg = err.message || "Không thể thêm vào giỏ hàng. Vui lòng thử lại!";
      setDebugInfo(`❌ ${errorMsg}`);
      alert(errorMsg);
    } finally {
      setAddingToCart(null);
    }
  };

  // Fetch products when category changes
  useEffect(() => {
    fetchProducts(selectedCategory);
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Format giá VNĐ
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get image URL
  const getImageUrl = (img: string | null): string => {
    if (!img) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop";
    if (img.startsWith("http")) return img;
    return `https://foodweb-be.onrender.com${img}`;
  };

  // Infinity loop: Tính index thực với modulo
  const getActualIndex = (index: number): number => {
    const len = products.length;
    if (len === 0) return 0;
    return ((index % len) + len) % len;
  };

  // Xử lý chuyển slide
  const goToSlide = (index: number): void => {
    if (isAnimating || products.length === 0) return;

    setIsAnimating(true);
    setCurrentIndex(index);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const nextSlide = (): void => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = (): void => {
    goToSlide(currentIndex - 1);
  };

  // Tính toán vị trí theo hình vòng cung
  const getCardStyle = (
    productIndex: number,
    currentIdx: number
  ): React.CSSProperties => {
    const len = products.length;
    if (len === 0) return {};

    let diff = productIndex - getActualIndex(currentIdx);

    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;

    const absPosition = Math.abs(diff);

    // Ẩn các thẻ quá xa
    if (absPosition > 2) {
      return {
        transform: `translateX(${diff * 50}%) scale(0.7)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
      };
    }

    // Thẻ giữa (chính) - Thấp nhất
    if (diff === 0) {
      return {
        transform: "translateX(0%) translateY(0px) scale(1.1)",
        opacity: 1,
        zIndex: 50,
        pointerEvents: "auto",
      };
    }

    // Thẻ hai bên - Nâng lên dần
    const yOffset = Math.abs(diff) * 80;
    const zIndex = diff > 0 ? 40 - absPosition : 30 - absPosition;

    return {
      transform: `translateX(${diff * 70}%) translateY(-${yOffset}px) scale(${1 - absPosition * 0.15})`,
      opacity: 0.6 - absPosition * 0.2,
      zIndex: zIndex,
      pointerEvents: "auto",
    };
  };

  // Auto play
  useEffect(() => {
    if (products.length === 0 || loading) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, products.length, loading]);

  // Handle category change
  const handleCategoryChange = (category: Category) => {
    if (isAnimating || loading) return;
    setSelectedCategory(category);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Debug Info Banner */}
      {debugInfo && (
        <div className={`fixed top-4 right-4 z-[9999] max-w-md p-4 rounded-xl shadow-2xl ${debugInfo.includes('✅') ? 'bg-green-500/90' : 'bg-red-500/90'
          } text-white flex items-start gap-3 animate-slide-in`}>
          <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold whitespace-pre-wrap">{debugInfo}</p>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Sản phẩm nổi bật
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl mb-6">
          Khám phá những món ăn & đồ uống healthy được yêu thích nhất
        </p>

        {/* Category Tabs */}
        <div className="flex gap-4 justify-center items-center">
          <button
            onClick={() => handleCategoryChange("food")}
            disabled={isAnimating || loading}
            className={`
              px-8 py-3 rounded-full font-semibold text-lg
              flex items-center gap-2 transition-all duration-300
              ${selectedCategory === "food"
                ? "bg-white text-emerald-700 shadow-xl scale-105"
                : "bg-white/20 text-white hover:bg-white/30"
              }
              disabled:cursor-not-allowed disabled:opacity-50
            `}
          >
            <UtensilsCrossed size={22} />
            Đồ ăn
          </button>

          <button
            onClick={() => handleCategoryChange("drink")}
            disabled={isAnimating || loading}
            className={`
              px-8 py-3 rounded-full font-semibold text-lg
              flex items-center gap-2 transition-all duration-300
              ${selectedCategory === "drink"
                ? "bg-white text-emerald-700 shadow-xl scale-105"
                : "bg-white/20 text-white hover:bg-white/30"
              }
              disabled:cursor-not-allowed disabled:opacity-50
            `}
          >
            <Coffee size={22} />
            Đồ uống
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-[600px] gap-4">
          <Loader2 className="animate-spin text-white" size={48} />
          <p className="text-white text-lg">Đang tải sản phẩm...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center h-[600px] gap-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 max-w-md">
            <p className="text-red-300 text-center">{error}</p>
          </div>
          <button
            onClick={() => fetchProducts(selectedCategory)}
            className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[600px] gap-4">
          <p className="text-white text-xl">
            Không có sản phẩm nào trong danh mục này
          </p>
        </div>
      )}

      {/* Carousel Container */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="relative w-full max-w-6xl h-[600px] flex items-center justify-center">
            {/* Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {products.map((product, index) => {
                const style = getCardStyle(index, currentIndex);
                const isActive = index === getActualIndex(currentIndex);
                const isAdding = addingToCart === product.id;
                const isAdded = addedToCart === product.id;

                return (
                  <div
                    key={product.id}
                    className="absolute w-80 h-[450px] cursor-pointer"
                    style={{
                      ...style,
                      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onClick={() =>
                      !isActive &&
                      goToSlide(
                        currentIndex + (index - getActualIndex(currentIndex))
                      )
                    }
                  >
                    <div className="w-full h-[90%] bg-gray-200 rounded-2xl shadow-2xl overflow-hidden hover:shadow-emerald-500/20 transition-shadow duration-300">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={getImageUrl(product.img)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop";
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Còn {product.quantity}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col justify-between h-[calc(100%-14rem)]">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <div className="text-xl font-semibold text-emerald-600 whitespace-nowrap">
                              {formatPrice(product.price)}
                            </div>
                          </div>
                        </div>

                        {/* Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id, product.name);
                          }}
                          disabled={isAdding || isAdded || product.quantity === 0}
                          className={`
                            w-full py-3 rounded-xl font-semibold 
                            flex items-center justify-center gap-2 
                            transition-all duration-300 transform shadow-lg
                            ${isAdded
                              ? "bg-green-500 text-white"
                              : product.quantity === 0
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:scale-105"
                            }
                            disabled:cursor-not-allowed disabled:opacity-70
                          `}
                        >
                          {isAdding ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />
                              Đang thêm...
                            </>
                          ) : isAdded ? (
                            <>
                              <Check size={20} />
                              Đã thêm vào giỏ
                            </>
                          ) : product.quantity === 0 ? (
                            "Hết hàng"
                          ) : (
                            <>
                              <ShoppingCart size={20} />
                              Thêm vào giỏ hàng
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="hidden md:flex absolute left-0 z-40 w-14 h-14 bg-white/90 hover:bg-white rounded-full items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="text-emerald-600" size={28} />
            </button>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="hidden md:flex absolute right-0 z-40 w-14 h-14 bg-white/90 hover:bg-white rounded-full items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="text-emerald-600" size={28} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2 mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  goToSlide(
                    currentIndex + (index - getActualIndex(currentIndex))
                  )
                }
                disabled={isAnimating}
                className={`h-2 rounded-full transition-all duration-300 ${index === getActualIndex(currentIndex)
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;