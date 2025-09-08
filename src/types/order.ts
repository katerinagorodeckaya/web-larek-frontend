export interface IOrderForm {
  payment: 'online' | 'offline';
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IOrderForm {
  items: string[]; 
  total: number;
}