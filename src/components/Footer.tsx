import React from 'react';
import { Leaf, Truck } from 'lucide-react';
import { footerLinks } from '../data/data';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-lime-400" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                NutriJour
              </span>
            </div>
            <p className="text-gray-400">
              Ăn đêm thông minh và lành mạnh. Các bữa ăn tươi ngon, bổ dưỡng được giao 24/7.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-lime-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-lime-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Tải ứng dụng</h4>
            <p className="text-gray-400 mb-4">Tải ứng dụng của chúng tôi để đặt hàng nhanh hơn và nhận ưu đãi độc quyền cho các bữa ăn lành mạnh.</p>
            <div className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-lime-400" />
              <span className="text-sm text-gray-400">Miễn phí giao hàng cho đơn hàng trên 200K</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 NutriJour. Tất cả quyền được bảo lưu. Được tạo với 💚 dành cho những người quan tâm đến sức khỏe.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;