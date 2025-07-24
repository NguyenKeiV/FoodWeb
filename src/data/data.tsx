import { Clock, Leaf, Heart, Award, Users } from 'lucide-react';
import { Product, Benefit } from '../types/type';

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Cà Ri Sốt Teriyaki",
    description: "Cà ri thơm ngon với sốt teriyaki, ăn kèm rau củ tươi ngon",
    price: "110K",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "385 cal",
    rating: 4.9,
    popular: true
  },
  {
    id: 2,
    name: "Salad Gà Nướng Mật Ong",
    description: "Salad gà nướng mật ong với rau xanh tươi và thảo mộc",
    price: "70K",
    image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "295 cal",
    rating: 4.8,
    popular: true
  },
  {
    id: 3,
    name: "Cơm Gạo Lứt Huyết Rồng Kèm Gà",
    description: "Cơm gạo lứt huyết rồng với gà nướng và món phụ bổ dưỡng",
    price: "70K",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "365 cal",
    rating: 4.7,
    popular: false
  },
  {
    id: 4,
    name: "Cơm Gà Sốt Mè Rang",
    description: "Gà sốt mè rang thơm ngon ăn kèm cơm trắng",
    price: "70K",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "340 cal",
    rating: 4.6,
    popular: false
  },
  {
    id: 5,
    name: "Salad Rau Clean",
    description: "Salad rau sạch tươi ngon với nước sốt lành mạnh",
    price: "45K",
    image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "180 cal",
    rating: 4.5,
    popular: false
  },
  {
    id: 6,
    name: "Cơm Trộn Hàn Ngũ Sắc",
    description: "Cơm trộn kiểu Hàn với năm màu sắc nguyên liệu tươi ngon",
    price: "70K",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "320 cal",
    rating: 4.7,
    popular: true
  },
  {
    id: 7,
    name: "Cơm Gạo Lứt Rau Củ Chay",
    description: "Cơm gạo lứt với rau củ tươi và đậu phụ",
    price: "70K",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "285 cal",
    rating: 4.4,
    popular: false
  },
  {
    id: 8,
    name: "Salad Bơ Nướng Sốt Mè Rang",
    description: "Salad bơ nướng với nước sốt mè rang thơm ngon",
    price: "70K",
    image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "310 cal",
    rating: 4.6,
    popular: false
  },
  {
    id: 9,
    name: "Cơm Gạo Lứt Lươn Gà Sốt Ngũ Vị",
    description: "Cơm gạo lứt với lươn và gà trong sốt ngũ vị đặc biệt",
    price: "65K",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "395 cal",
    rating: 4.8,
    popular: false
  }
];

export const beverageProducts: Product[] = [
  {
    id: 10,
    name: "Nước Dưa Hấu",
    description: "Nước ép dưa hấu tươi, ngọt tự nhiên và giải khát",
    price: "25K",
    image: "https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "85 cal",
    rating: 4.7,
    popular: true
  },
  {
    id: 11,
    name: "Nước Ép Táo",
    description: "Nước ép táo nguyên chất, giàu vitamin và chất chống oxy hóa",
    price: "30K",
    image: "https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "110 cal",
    rating: 4.6,
    popular: false
  },
  {
    id: 12,
    name: "Nước Ép Thơm",
    description: "Nước ép dứa tươi, nhiệt đới và giàu vitamin",
    price: "25K",
    image: "https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "95 cal",
    rating: 4.5,
    popular: false
  },
  {
    id: 13,
    name: "Nước Ép Cam",
    description: "Nước cam vắt tươi, giàu vitamin C",
    price: "25K",
    image: "https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg?auto=compress&cs=tinysrgb&w=400",
    calories: "100 cal",
    rating: 4.8,
    popular: true
  }
];

export const benefits: Benefit[] = [
  {
    icon: <Clock className="w-8 h-8 text-lime-600" />,
    title: "Giao Hàng Tươi 24/7",
    description: "Các bữa ăn bổ dưỡng được giao tươi ngon bất cứ khi nào bạn cần"
  },
  {
    icon: <Leaf className="w-8 h-8 text-lime-600" />,
    title: "100% Tự Nhiên",
    description: "Không chất bảo quản, không thành phần nhân tạo, chỉ dinh dưỡng thuần khiết"
  },
  {
    icon: <Heart className="w-8 h-8 text-lime-600" />,
    title: "Ưu Tiên Sức Khỏe",
    description: "Mọi bữa ăn đều được chuyên gia dinh dưỡng phê duyệt và dưới 400 calo"
  }
];

export const heroStats = [
  {
    icon: <Award className="h-5 w-5 text-lime-600" />,
    text: "Đánh giá 4.9/5"
  },
  {
    icon: <Users className="h-5 w-5 text-lime-600" />,
    text: "15K+ Khách hàng hài lòng"
  }
];

export const navigationItems = [
  { label: 'Trang chủ', href: '#home' },
  { label: 'Thực đơn', href: '#products' },
  { label: 'Giới thiệu', href: '#about' }
];

export const footerLinks = {
  quickLinks: [
    { label: 'Thực đơn', href: '#' },
    { label: 'Về chúng tôi', href: '#' },
    { label: 'Liên hệ', href: '#' },
    { label: 'Câu hỏi thường gặp', href: '#' }
  ],
  support: [
    { label: 'Trung tâm hỗ trợ', href: '#' },
    { label: 'Theo dõi đơn hàng', href: '#' },
    { label: 'Thông tin dinh dưỡng', href: '#' },
    { label: 'Khu vực giao hàng', href: '#' }
  ]
};