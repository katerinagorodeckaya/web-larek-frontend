import { IOrderForm, IOrder, IValidationResult } from "../../types/order";

export class OrderModel {
    payment: "online" | "offline" | "" = "";
    email: string = "";
    phone: string = "";
    address: string = "";

    validatePayment(): IValidationResult {
        if (this.payment !== "online" && this.payment !== "offline") {
            return { valid: false, message: "Выберите способ оплаты" };
        }
        return { valid: true };
    }

    validateAddress(): IValidationResult {
        if (!this.address.trim()) {
            return { valid: false, message: "Укажите адрес доставки" };
        }
        return { valid: true };
    }

    validateContacts(): IValidationResult {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
        const phoneValid = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(this.phone);
        
        if (!emailValid) {
            return { valid: false, message: "Введите корректный email" };
        }
        if (!phoneValid) {
            return { valid: false, message: "Введите корректный номер телефона" };
        }
        return { valid: true };
    }

    validateAll(): boolean {
        return (
            this.validatePayment().valid &&
            this.validateAddress().valid &&
            this.validateContacts().valid
        );
    }

    getOrderData(): IOrderForm {
        return {
            payment: this.payment as "online" | "offline",
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    setOrderData(data: IOrderForm): void {
        this.payment = data.payment;
        this.email = data.email;
        this.phone = data.phone;
        this.address = data.address;
    }

    resetOrderData(): void {
        this.payment = "";
        this.email = "";
        this.phone = "";
        this.address = "";
    }

   
    getUserData() {
        return {
            email: this.email,
            phone: this.phone,
            address: this.address,
            payment: this.payment
        };
    }

    resetUserData(): void {
        this.resetOrderData();
    }
}