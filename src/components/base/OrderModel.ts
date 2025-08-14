import { Api } from '../base/api';
import { IOrderForm, IOrder } from '../../types/order';

export class OrderModel {
  constructor(private api: Api) {}

  async createOrder(order: IOrderForm): Promise<IOrder> {
    return this.api.post('/order', order) as Promise<IOrder>;
  }
}