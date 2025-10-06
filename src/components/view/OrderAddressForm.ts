import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IOrderAddressForm {
    address: string;
    payment: string;
    error: string;
    canSubmit: boolean;
}

export class OrderAddressForm extends Component<IOrderAddressForm> {
    protected _submitButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this._submitButton = ensureElement<HTMLButtonElement>('.order__button', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._addressInput.addEventListener('input', () => {
            this.events.emit('order:address:change', { value: this._addressInput.value });
        });

        this._cardButton.addEventListener('click', () => {
            this.events.emit('order:payment:change', { payment: 'online' });
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit('order:payment:change', { payment: 'offline' });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('order:address:submit');
        });
    }

    render(data?: Partial<IOrderAddressForm>): HTMLElement {
        if (data) {
            if (data.address !== undefined) this.address = data.address;
            if (data.payment !== undefined) this.payment = data.payment;
            if (data.error !== undefined) this.error = data.error;
            if (data.canSubmit !== undefined) this.canSubmit = data.canSubmit;
        }
        return this.container;
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set payment(value: string) {
        this._cardButton.classList.toggle('button_alt-active', value === 'online');
        this._cashButton.classList.toggle('button_alt-active', value === 'offline');
    }

    set error(value: string) {
        this._errors.textContent = value;
    }

    set canSubmit(value: boolean) {
        this._submitButton.disabled = !value;
    }
}