import { IProduct } from "../../types/product";

export class ProductModel {
    private productList: IProduct[] = [];

    setProductList(products: IProduct[]): void {
        this.productList = [...products];
    }

    getProductList(): IProduct[] {
        return [...this.productList];
    }

    getProductById(id: string): IProduct | undefined {
        return this.productList.find((product) => product.id === id);
    }


    getItemById(id: string): IProduct | undefined {
        return this.getProductById(id);
    }
}