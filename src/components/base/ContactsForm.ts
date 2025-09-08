import { EventEmitter } from './events';
import { IOrderForm } from '../../types/order';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class ContactsForm {
  protected _element: HTMLElement;
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(
    protected template: HTMLTemplateElement,
    protected events: EventEmitter
  ) {
    this._element = cloneTemplate(template);
    this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this._element);
    this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this._element);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this._element);
    this._errors = ensureElement('.form__errors', this._element);

    this.addEvents();
    this.validate();
  }

  protected addEvents() {
    this._emailInput.addEventListener('input', () => this.validate());
    this._phoneInput.addEventListener('input', () => this.validate());

    this._element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });
  }

  protected validate() {
    const emailValid = this.validateEmail(this._emailInput.value);
    const phoneValid = this.validatePhone(this._phoneInput.value);
    
    this._submitButton.disabled = !(emailValid && phoneValid);
    return emailValid && phoneValid;
  }

  protected validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  protected validatePhone(phone: string): boolean {
    return /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone);
  }

  protected submit() {
    if (this.validate()) {
      const contactsData: Partial<IOrderForm> = {
        email: this._emailInput.value.trim(),
        phone: this._phoneInput.value.trim()
      };
      this.events.emit('order:submit:second', contactsData);
    }
  }

  setErrors(errors: string[]) {
    this._errors.textContent = errors.join(', ');
  }

  clear() {
    this._emailInput.value = '';
    this._phoneInput.value = '';
    this.validate();
  }

  get element(): HTMLElement {
    return this._element;
  }
}