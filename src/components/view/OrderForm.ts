import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IOrderForm {
  address: string;
  payment: string;
  valid: boolean;
  errors: string;
}

export class OrderForm extends Component<IOrderForm> {
  protected _submitButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
    this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
    this._errors = ensureElement<HTMLElement>('.form__errors', container);

    this._addressInput.addEventListener('input', () => {
      this.events.emit('order.address:change', { value: this._addressInput.value });
    });

    this._cardButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { method: 'online' });
    });

    this._cashButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { method: 'offline' });
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  set payment(value: string) {
    this._cardButton.classList.toggle('button_alt-active', value === 'online');
    this._cashButton.classList.toggle('button_alt-active', value === 'offline');
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }
}