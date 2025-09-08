import { EventEmitter } from './events';
import { IOrderForm } from '../../types/order';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class OrderForm {
  protected _element: HTMLElement;
  protected _onlineButton: HTMLButtonElement;
  protected _offlineButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  protected selectedPayment: 'online' | 'offline' | null = null;

  constructor(
    protected template: HTMLTemplateElement,
    protected events: EventEmitter
  ) {
    this._element = cloneTemplate(template);
    
    this._onlineButton = ensureElement<HTMLButtonElement>('button[data-payment="online"]', this._element);
    this._offlineButton = ensureElement<HTMLButtonElement>('button[data-payment="offline"]', this._element);
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this._element);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this._element);
    this._errors = ensureElement('.form__errors', this._element);

    console.log('OrderForm initialized:', {
      onlineButton: this._onlineButton,
      offlineButton: this._offlineButton
    });

    this.addEvents();
    this.validate();
  }

  protected addEvents() {

    this._onlineButton.addEventListener('click', () => {
      console.log('Online button clicked');
      this.selectPayment('online');
    });

    this._offlineButton.addEventListener('click', () => {
      console.log('Offline button clicked');
      this.selectPayment('offline');
    });

    this._addressInput.addEventListener('input', () => {
      this.validate();
    });

    this._element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });
  }

  protected selectPayment(method: 'online' | 'offline') {
  console.log('Selecting payment:', method);
  
 
  this._onlineButton.classList.remove('button_alt-active'); 
  this._offlineButton.classList.remove('button_alt-active');
  

  if (method === 'online') {
    this._onlineButton.classList.add('button_alt-active');
  } else {
    this._offlineButton.classList.add('button_alt-active');
  }
  
  this.selectedPayment = method;
  this.validate();
}

  protected validate() {
    const isValid = this.selectedPayment !== null && this._addressInput.value.trim().length > 0;
    console.log('Validation:', { isValid, payment: this.selectedPayment, address: this._addressInput.value });
    this._submitButton.disabled = !isValid;
    return isValid;
  }

  protected submit() {
    if (this.validate()) {
      console.log('Submitting order:', this.selectedPayment, this._addressInput.value);
      const orderData: Partial<IOrderForm> = {
        payment: this.selectedPayment!,
        address: this._addressInput.value.trim()
      };
      this.events.emit('order:submit:first', orderData);
    }
  }

  setErrors(errors: string[]) {
    this._errors.textContent = errors.join(', ');
  }

clear() {
  this.selectedPayment = null;
  this._onlineButton.classList.remove('button_alt-active');
  this._offlineButton.classList.remove('button_alt-active');
  this._addressInput.value = '';
  this.validate();
}

  get element(): HTMLElement {
    return this._element;
  }
}