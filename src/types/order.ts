export interface IOrderForm {
    payment: "online" | "offline";
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IValidationResult {
    valid: boolean;
    message?: string;
}


export interface IOrderRequest extends IOrderForm {
    items: string[];
    total: number;
}