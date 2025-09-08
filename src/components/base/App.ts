import { EventEmitter } from './events';
import { ProductModel } from './ProductModel';
import { OrderModel } from './OrderModel';
import { Events } from '../../types/events';
import { AppState } from '../../types/appState';
import { IProduct } from '../../types/product';

export class App {
  private basket: string[] = [];
  private catalog: IProduct[] = [];

  constructor(
    private events: EventEmitter,
    private productModel: ProductModel,
    private orderModel: OrderModel
  ) {
    this.events.on(Events.ITEM_ADDED, this.addToBasket);
    this.events.on('item:removed', this.removeFromBasket);
    this.events.on('order:open', this.openOrder);
    this.events.on('order:submit:first', this.submitOrderFirstStep);
    this.events.on('order:submit:second', this.submitOrderSecondStep);
    
    this.init();
  }

  private async init() {
    try {
      const products = await this.productModel.loadProducts();
      this.catalog = products;
      this.basket = this.productModel.state.basket;
      
      this.updateBasketCounter();
      this.events.emit('products:loaded', { catalog: this.catalog });
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }


  private addToBasket = (data: { id: string }) => {
    if (!this.basket.includes(data.id)) {
      this.basket.push(data.id);
      this.productModel.state.basket = this.basket;
      this.updateBasketCounter();
      this.events.emit('basket:changed', { 
        basket: this.basket,
        product: this.catalog.find(p => p.id === data.id)
      });
    }
  };

  private removeFromBasket = (data: { id: string }) => {
    this.basket = this.basket.filter(id => id !== data.id);
    this.productModel.state.basket = this.basket;
    this.updateBasketCounter();
    this.events.emit('basket:changed', { basket: this.basket });
  };

  private updateBasketCounter() {
    const counter = document.querySelector('.header__basket-counter');
    if (counter) {
      counter.textContent = this.basket.length.toString();
    }
  }

  private openOrder = () => {
    if (this.basket.length === 0) {
      this.events.emit('order:error', { message: 'Корзина пуста' });
      return;
    }

    const total = this.calculateTotal();
    this.events.emit('order:opened', { 
      basket: this.basket,
      total 
    });
  };

  private submitOrderFirstStep = (data: any) => {
    this.productModel.state.order = {
      ...data,
      items: this.basket,
      total: this.calculateTotal()
    };
    
    this.events.emit('order:first:completed', data);
  };

   private submitOrderSecondStep = async (data: any) => {
    try {
      const total = this.calculateTotal();
      const orderData = {
        ...this.productModel.state.order,
        ...data,
        items: this.basket,
        total: total
      };

      await this.orderModel.createOrder(orderData);
      
      this.events.emit('order:success', { total: total });
      this.clearBasket();
      
    } catch (error) {
      console.error('Order submission error:', error);
      this.events.emit('order:error', { error });
    }
  };

  private clearBasket = () => {
    this.basket = [];
    this.productModel.state.basket = this.basket;
    this.updateBasketCounter();
    this.events.emit('basket:changed', { basket: this.basket });
  };

  private calculateTotal(): number {
    return this.basket.reduce((total, productId) => {
      const product = this.catalog.find(p => p.id === productId);
      return total + (product?.price || 0);
    }, 0);
  }
}