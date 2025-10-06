import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IOrderContactsForm {
    email: string;
    phone: string;
    error: string;
    canSubmit: boolean;
}

export class OrderContactsForm extends Component<IOrderContactsForm> {
    protected _submitButton: HTMLButtonElement;
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _errors: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._emailInput.addEventListener('input', () => {
            this.events.emit('order:email:change', { value: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('order:phone:change', { value: this._phoneInput.value });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('order:contacts:submit');
        });
    }

    render(data?: Partial<IOrderContactsForm>): HTMLElement {
        if (data) {
            if (data.email !== undefined) this.email = data.email;
            if (data.phone !== undefined) this.phone = data.phone;
            if (data.error !== undefined) this.error = data.error;
            if (data.canSubmit !== undefined) this.canSubmit = data.canSubmit;
        }
        return this.container;
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    set error(value: string) {
        this._errors.textContent = value;
    }

    set canSubmit(value: boolean) {
        this._submitButton.disabled = !value;
    }
}