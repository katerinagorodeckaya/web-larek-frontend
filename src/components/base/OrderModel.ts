import { Api } from './api';
import { IOrderForm, IOrder } from '../../types/order';

export class OrderModel {
  constructor(private api: Api) {}

  async createOrder(order: IOrderForm & { items: string[]; total: number }): Promise<IOrder> {
    try {
      console.log('Creating order:', order);
      const response = await this.api.post('/order', order);
      console.log('Order created successfully:', response);
      return response as IOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  validateOrder(order: Partial<IOrderForm>): string[] {
    const errors: string[] = [];

    if (!order.payment) {
      errors.push('Выберите способ оплаты');
    }

    if (!order.address || order.address.trim().length === 0) {
      errors.push('Введите адрес доставки');
    }

    if (!order.email || !this.validateEmail(order.email)) {
      errors.push('Введите корректный email');
    }

    if (!order.phone || !this.validatePhone(order.phone)) {
      errors.push('Введите корректный телефон');
    }

    return errors;
  }

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private validatePhone(phone: string): boolean {
    return /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone);
  }
}