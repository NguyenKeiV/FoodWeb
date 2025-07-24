import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { featuredProducts, beverageProducts } from '../data/data';
import ProductCard from '../components/ProductCard';

const FullMenu: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'beverages'>('all');

  const handleGoBack = () => {
    navigate('/');
  };

  const getFilteredProducts = () => {
    switch (activeCategory) {
      case 'food':
        return featuredProducts;
      case 'beverages':
        return beverageProducts;
      default:
        return [...featuredProducts, ...beverageProducts];
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-lime-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleGoBack}
                className="flex items-center text-gray-700 hover:text-lime-600 transition-colors duration-200 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Quay lại</span>
              </button>
              <div className="flex items-center">
                <Leaf className="h-8 w-8 text-lime-600" />
                <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent">
                  NutriJour
                </span>
              </div>
            </div>
            <button className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-lime-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Đặt hàng ngay
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Toàn Bộ Thực Đơn
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá tất cả các món ăn đêm lành mạnh và nước ép tươi ngon của chúng tôi. 
            Mỗi món đều được chế biến cẩn thận bởi các chuyên gia dinh dưỡng.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-lime-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-lime-600'
              }`}
            >
              Tất cả ({featuredProducts.length + beverageProducts.length})
            </button>
            <button
              onClick={() => setActiveCategory('food')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === 'food'
                  ? 'bg-gradient-to-r from-lime-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-lime-600'
              }`}
            >
              Món chính ({featuredProducts.length})
            </button>
            <button
              onClick={() => setActiveCategory('beverages')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                activeCategory === 'beverages'
                  ? 'bg-gradient-to-r from-lime-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-lime-600'
              }`}
            >
              Nước ép tươi ({beverageProducts.length})
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="transform transition-all duration-300 hover:scale-105">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600">
              Hiện tại chưa có sản phẩm nào trong danh mục này.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {featuredProducts.length + beverageProducts.length}+
              </div>
              <p className="text-gray-600 font-medium">Món ăn & đồ uống</p>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                &lt;400
              </div>
              <p className="text-gray-600 font-medium">Calo mỗi món</p>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-gray-600 font-medium">Giao hàng tươi</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Sẵn sàng đặt hàng?
            </h2>
            <p className="text-xl text-lime-100 mb-8 max-w-2xl mx-auto">
              Thỏa mãn cơn thèm đêm với những món ăn lành mạnh, ngon miệng được giao tận nơi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-lime-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Đặt hàng ngay
              </button>
              <button 
                onClick={handleGoBack}
                className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-lime-600 transition-all duration-200 font-medium text-lg"
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullMenu;