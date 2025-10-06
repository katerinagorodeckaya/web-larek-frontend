import { IProduct } from "../../types/product";

export class BasketModel {
    private basketItems: IProduct[] = [];

    setBasketItems(products: IProduct[]): void {
        this.basketItems = products;
    }

    getBasketItems(): IProduct[] {
        return this.basketItems;
    }

    addToBasket(product: IProduct): void {
        if (this.isInBasket(product.id)) return;
        this.basketItems.push(product);
    }

    removeFromBasket(id: string): void {
        this.basketItems = this.basketItems.filter((item) => item.id !== id);
    }

    getBasketCount(): number {
        return this.basketItems.length;
    }

    getBasketTotal(): number {
        return this.basketItems.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    isInBasket(id: string): boolean {
        return this.basketItems.some((item) => item.id === id);
    }

    clearBasket(): void {
        this.basketItems = [];
    }

    getProductAvailability(id: string): boolean {
        return this.isInBasket(id);
    }

    addProductToCart(product: IProduct): void {
        this.addToBasket(product);
    }

    removeProductFromCart(id: string): void {
        this.removeFromBasket(id);
    }

    getCartProductsList(): IProduct[] {
        return this.getBasketItems();
    }

    getCartProductPrice(): number {
        return this.getBasketTotal();
    }

    emptyCart(): void {
        this.clearBasket();
    }
}