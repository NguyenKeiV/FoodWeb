import React, { useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { navigationItems } from '../data/data';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (href: string) => {
    const sectionId = href.replace('#', '');
    onNavigate(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Leaf className="h-8 w-8 text-lime-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent">
                NutriJour
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="text-gray-700 hover:text-lime-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
            <button className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-lime-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Đặt hàng ngay
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-lime-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="block px-3 py-2 text-gray-700 hover:text-lime-600 transition-colors duration-200 w-full text-left font-medium"
              >
                {item.label}
              </button>
            ))}
            <button className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-6 py-2 rounded-full hover:from-lime-600 hover:to-emerald-600 transition-all duration-200 font-medium mt-4 shadow-lg">
              Đặt hàng ngay
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;