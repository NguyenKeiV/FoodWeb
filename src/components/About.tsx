import React from 'react';
import { benefits } from '../data/data';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn NutriJour?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Chúng tôi tin rằng việc ăn đêm nên cung cấp năng lượng cho cơ thể bạn, không làm hỏng 
            mục tiêu sức khỏe của bạn. Các bữa ăn được chế biến cẩn thận của chúng tôi được thiết kế 
            bởi các chuyên gia dinh dưỡng để thỏa mãn cơn thèm đồng thời hỗ trợ hành trình sức khỏe của bạn.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-8 rounded-3xl bg-gradient-to-br from-lime-50 to-emerald-50 hover:from-lime-100 hover:to-emerald-100 transition-all duration-200 transform hover:-translate-y-2 shadow-lg hover:shadow-xl">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;