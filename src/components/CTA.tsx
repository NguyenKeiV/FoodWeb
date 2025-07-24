import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Sẵn sàng thay đổi thói quen ăn đêm của bạn?
        </h2>
        <p className="text-xl text-lime-100 mb-8 max-w-2xl mx-auto">
          Tham gia cùng hàng nghìn người quan tâm đến sức khỏe đã khám phá ra sự cân bằng hoàn hảo 
          giữa việc thỏa mãn cơn thèm và duy trì mục tiêu sức khỏe với NutriJour.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-lime-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Đặt hàng ngay
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-lime-600 transition-all duration-200 font-medium text-lg">
            Tải ứng dụng
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;