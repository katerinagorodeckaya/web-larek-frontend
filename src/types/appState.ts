import { IProduct } from './product';
import { IOrder } from './order';

export interface AppState {
  catalog: IProduct[];
  basket: string[]; // ID товаров
  order: IOrder | null;
}