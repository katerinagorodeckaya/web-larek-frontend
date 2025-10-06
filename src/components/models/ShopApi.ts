import { Api } from "../base/Api";
import { IProduct, IOrderForm, IOrder } from "../../types";

export class ShopApi {
    constructor(private api: Api) {}

    getProducts(): Promise<IProduct[]> {
        return this.api
            .get<{ items: IProduct[] }>("/product")
            .then((response) => response.items);
    }

    createOrder(order: IOrderForm & { items: string[]; total: number }): Promise<IOrder> {
        return this.api.post<IOrder>("/order", order);
    }

    // Новый метод для совместимости с примером
    postOrder(order: IOrderForm & { items: string[]; total: number }): Promise<IOrder> {
        return this.createOrder(order);
    }
}