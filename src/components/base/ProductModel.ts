import { IProduct } from '../../types/product';
import { AppState } from '../../types/appState'; 
import { Api } from '../base/api'; 

export class ProductModel {
    public state: AppState;
    constructor(private api: Api, state: AppState) {}

    async loadProducts(): Promise<IProduct[]> {
        const data = await this.api.get('/product') as { items: IProduct[] };
        this.state.catalog = data.items;
        return data.items;
    }
}