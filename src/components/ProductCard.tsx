import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types/type';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 h-full">
      {product.popular && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Phổ biến
        </div>
      )}
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-lime-600">
          {product.calories}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          <div className="flex items-center flex-shrink-0 ml-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600 font-medium">{product.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-lime-600 to-emerald-600 bg-clip-text text-transparent">
            {product.price}
          </span>
          <button className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-4 py-2 rounded-full hover:from-lime-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-shrink-0">
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;