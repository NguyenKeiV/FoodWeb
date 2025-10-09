import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredProducts, beverageProducts } from '../data/data';
import ProductCard from './ProductCard';


interface ProductsProps {
  onViewFullMenu?: () => void;
}

const Products: React.FC<ProductsProps> = ({ onViewFullMenu }) => {
  const [activeTab, setActiveTab] = useState<'food' | 'beverages'>('food');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of card + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);

    // Add cursor grabbing style
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!scrollContainerRef.current) return;

    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = 'auto';
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!scrollContainerRef.current) return;

    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
    scrollContainerRef.current.style.userSelect = 'auto';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const currentProducts = activeTab === 'food' ? featuredProducts : beverageProducts;

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-gray-50 to-lime-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Thực Đơn Đêm Phổ Biến
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Những lựa chọn ăn đêm lành mạnh được yêu thích nhất của chúng tôi, được chế biến bởi
            các chuyên gia dinh dưỡng và được những người quan tâm đến sức khỏe yêu thích.
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('food')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${activeTab === 'food'
                  ? 'bg-gradient-to-r from-lime-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-lime-600'
                  }`}
              >
                Món chính
              </button>
              <button
                onClick={() => setActiveTab('beverages')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${activeTab === 'beverages'
                  ? 'bg-gradient-to-r from-lime-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-lime-600'
                  }`}
              >
                Nước ép tươi
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 hidden md:flex items-center justify-center"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 hidden md:flex items-center justify-center"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Scrollable Products Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 md:px-12 cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {currentProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-80">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(currentProducts.length / 3) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 transition-colors duration-200"
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={onViewFullMenu}
            className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-8 py-4 rounded-full hover:from-lime-600 hover:to-emerald-600 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Xem toàn bộ thực đơn
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;