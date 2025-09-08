import { IProduct } from '../../types/product';
import { AppState } from '../../types/appState';
import { Api } from './api';

export class ProductModel {
  public state: AppState;

  constructor(
    private api: Api,
    initialState: AppState
  ) {
    this.state = { ...initialState };
  }

  async loadProducts(): Promise<IProduct[]> {
    try {
      const data = await this.api.get('/product') as { items: IProduct[] };
      this.state.catalog = data.items;
      return data.items;
    } catch (error) {
      console.error('Failed to load products:', error);
      throw error;
    }
  }

  getProductById(id: string): IProduct | undefined {
    return this.state.catalog.find(product => product.id === id);
  }

  getBasketProducts(): IProduct[] {
    return this.state.catalog.filter(product => 
      this.state.basket.includes(product.id)
    );
  }

  clearBasket(): void {
    this.state.basket = [];
  }
}