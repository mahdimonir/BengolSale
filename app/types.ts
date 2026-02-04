export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image: string;
}

export type ProductSize = 'M' | 'L' | 'XL' | 'XXL';

export interface Combo {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  isPack: boolean;
  color?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
}
