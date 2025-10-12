import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, UtensilsCrossed, Coffee } from "lucide-react";

// ✅ Type definitions
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  category: "food" | "drink";
}

type Category = "food" | "drink";

// Fake data sản phẩm
const productsData: Product[] = [
  // ĐỒ ĂN
  {
    id: 1,
    name: "Salad ức gà",
    price: 65000,
    quantity: 15,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    description: "Salad tươi ngon với ức gà nướng",
    category: "food"
  },
  {
    id: 2,
    name: "Cơm gạo lứt",
    price: 55000,
    quantity: 18,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop",
    description: "Cơm gạo lứt đỏ hữu cơ giàu dinh dưỡng",
    category: "food"
  },
  {
    id: 3,
    name: "Súp bí đỏ",
    price: 48000,
    quantity: 12,
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=500&h=500&fit=crop",
    description: "Súp bí đỏ kem béo ngậy, ấm áp",
    category: "food"
  },
  {
    id: 4,
    name: "Sandwich bơ trứng",
    price: 42000,
    quantity: 22,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&h=500&fit=crop",
    description: "Bánh mì sandwich với bơ và trứng",
    category: "food"
  },
  // ĐỒ UỐNG
  {
    id: 5,
    name: "Nước ép cần tây",
    price: 45000,
    quantity: 20,
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=500&fit=crop",
    description: "Nước ép tươi mát từ cần tây organic",
    category: "drink"
  },
  {
    id: 6,
    name: "Sinh tố bơ",
    price: 50000,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&h=500&fit=crop",
    description: "Sinh tố bơ sánh mịn, bổ dưỡng",
    category: "drink"
  },
  {
    id: 7,
    name: "Trà xanh matcha",
    price: 40000,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&h=500&fit=crop",
    description: "Trà xanh matcha nguyên chất Nhật Bản",
    category: "drink"
  },
  {
    id: 8,
    name: "Nước dừa tươi",
    price: 35000,
    quantity: 28,
    image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=500&h=500&fit=crop",
    description: "Nước dừa xiêm tươi mát lạnh",
    category: "drink"
  }
];

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("food");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Lọc sản phẩm theo category
  const filteredProducts = productsData.filter(p => p.category === selectedCategory);

  // Format giá VNĐ
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // ✅ Infinity loop: Tính index thực với modulo
  const getActualIndex = (index: number): number => {
    const len = filteredProducts.length;
    return ((index % len) + len) % len;
  };

  // Xử lý chuyển slide
  const goToSlide = (index: number): void => {
    if (isAnimating) return;

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

  // Tính toán vị trí và style cho mỗi card
  const getCardStyle = (productIndex: number, currentIdx: number): React.CSSProperties => {
    const len = filteredProducts.length;

    let diff = productIndex - getActualIndex(currentIdx);

    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;

    const absPosition = Math.abs(diff);

    if (absPosition > 2) {
      return {
        transform: `translateX(${diff * 100}%) scale(0.7)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none'
      };
    }

    if (diff === 0) {
      return {
        transform: 'translateX(0%) scale(1.1)',
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto'
      };
    }

    return {
      transform: `translateX(${diff * 100}%) scale(${1 - absPosition * 0.15})`,
      opacity: 0.6 - absPosition * 0.2,
      zIndex: 20 - absPosition,
      pointerEvents: 'auto'
    };
  };

  // Reset index khi đổi category
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Auto play
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, selectedCategory]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden">
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
            onClick={() => setSelectedCategory("food")}
            disabled={isAnimating}
            className={`
              px-8 py-3 rounded-full font-semibold text-lg
              flex items-center gap-2 transition-all duration-300
              ${selectedCategory === "food"
                ? "bg-white text-emerald-700 shadow-xl scale-105"
                : "bg-white/20 text-white hover:bg-white/30"
              }
              disabled:cursor-not-allowed
            `}
          >
            <UtensilsCrossed size={22} />
            Đồ ăn
          </button>

          <button
            onClick={() => setSelectedCategory("drink")}
            disabled={isAnimating}
            className={`
              px-8 py-3 rounded-full font-semibold text-lg
              flex items-center gap-2 transition-all duration-300
              ${selectedCategory === "drink"
                ? "bg-white text-emerald-700 shadow-xl scale-105"
                : "bg-white/20 text-white hover:bg-white/30"
              }
              disabled:cursor-not-allowed
            `}
          >
            <Coffee size={22} />
            Đồ uống
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center">
        {/* Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {filteredProducts.map((product, index) => {
            const style = getCardStyle(index, currentIndex);
            const isActive = index === getActualIndex(currentIndex);

            return (
              <div
                key={product.id}
                className="absolute w-80 h-[450px] cursor-pointer"
                style={{
                  ...style,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={() => !isActive && goToSlide(currentIndex + (index - getActualIndex(currentIndex)))}
              >
                <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-emerald-500/20 transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Còn {product.quantity}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between h-[194px]">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-emerald-600 mb-4">
                        {formatPrice(product.price)}
                      </div>

                      {/* Button */}
                      <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <ShoppingCart size={20} />
                        Thêm vào giỏ hàng
                      </button>
                    </div>
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
        {filteredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(currentIndex + (index - getActualIndex(currentIndex)))}
            disabled={isAnimating}
            className={`h-2 rounded-full transition-all duration-300 ${index === getActualIndex(currentIndex)
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;