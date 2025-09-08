import { EventEmitter } from './events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class SuccessMessage {
  protected _element: HTMLElement;
  protected _title: HTMLElement;
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(
    protected template: HTMLTemplateElement,
    protected events: EventEmitter
  ) {
    this._element = cloneTemplate(template);
    this._title = ensureElement('.order-success__title', this._element);
    this._description = ensureElement('.order-success__description', this._element);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this._element);

    this.addEvents();

    this.events.on('order:success', (data: { total: number }) => {
      this.setData(data.total);
    });
  }

  protected addEvents() {
    this._closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  setData(total: number) {
    this._description.textContent = `Списано ${total} синапсов`;
  }

  get element(): HTMLElement {
    return this._element;
  }
}