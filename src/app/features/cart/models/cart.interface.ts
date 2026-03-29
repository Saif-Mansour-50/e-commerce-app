export interface Cart {
  _id: string;
  cartOwner: string;
  products: ProductElement[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

interface ProductElement {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

interface Product {
  subcategory: Subcategory[];
  _id: string;
  title: string;
  slug: string;
  quantity: number;
  imageCover: string;
  category: Category;
  brand: Category;
  ratingsAverage: number;
  id: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface CashOrderPayload {
  shippingAddress: ShippingAddress;
}

export interface CashOrderResponse {
  status: 'success' | 'fail';
  data: Data;
}

export interface Data {
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: string;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
}

export interface CartItem {
  count: number;
  _id: string;
  product: string;
  price: number;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}
