export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  calories: string;
  rating: number;
  popular: boolean;
}

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export interface NavigationItem {
  label: string;
  href: string;
  action?: () => void;
}