import React from 'react';
import { Award, ChevronRight, Star, Truck } from 'lucide-react';
import { heroStats } from '../data/data';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-lime-50 via-yellow-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-lime-100 text-lime-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              #1 Giao Đồ Ăn Đêm Lành Mạnh
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Thèm Ăn Đêm?
              <span className="block bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent">
                Ăn Thông Minh với NutriJour!
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Biến cơn đói lúc nửa đêm thành nguồn năng lượng lành mạnh. NutriJour giao những bữa ăn 
              ngon miệng, ít calo giúp thỏa mãn cơn thèm đồng thời giữ cho bạn tràn đầy năng lượng và khỏe mạnh. 
              Tiện lợi, ngon miệng và an toàn cho hành trình sức khỏe của bạn.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('products')} 
                className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-8 py-4 rounded-full hover:from-lime-600 hover:to-emerald-600 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Xem thực đơn
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-lime-500 text-lime-600 px-8 py-4 rounded-full hover:bg-lime-500 hover:text-white transition-all duration-200 font-medium text-lg">
                Tìm hiểu thêm
              </button>
            </div>
            <div className="mt-8 flex items-center space-x-8">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-700 font-medium">Đánh giá 4.9/5</span>
              </div>
              <div className="flex items-center">
                {heroStats[1].icon}
                <span className="ml-1 text-gray-700 font-medium">15K+ Khách hàng hài lòng</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Đồ ăn đêm lành mạnh NutriJour"
                className="rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-lime-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Miễn phí giao hàng</p>
                    <p className="text-sm text-gray-600">Đơn hàng trên 200K</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-lime-400 to-emerald-400 rounded-3xl transform rotate-6 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;