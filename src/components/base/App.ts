import { EventEmitter } from './events';
import { ProductModel } from './ProductModel';
import { OrderModel } from './OrderModel';
import { Events } from '../../types/events';

export class App {
  constructor(
    private events: EventEmitter,
    private productModel: ProductModel,
    private orderModel: OrderModel
  ) {
    this.events.on(Events.ITEM_ADDED, this.addToBasket);
  }

  private addToBasket = (item: { id: string }) => {
    this.productModel.state.basket.push(item.id);
  };
}