export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image?: string;
  category?: string; // 'софт-скил', 'другое', etc.
}