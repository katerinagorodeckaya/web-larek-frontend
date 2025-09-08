import { EventEmitter } from './events';
import { ensureElement } from '../../utils/utils';

export class Modal {
  protected _element: HTMLElement;
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(
    protected events: EventEmitter,
    protected modalId: string = 'modal-container' 
  ) {
    this._element = ensureElement<HTMLElement>(`#${modalId}`);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this._element);
    this._content = ensureElement('.modal__content', this._element);

    this.addEvents();
  }

  protected addEvents() {
    this._closeButton.addEventListener('click', () => this.close());
    this._element.addEventListener('click', (e) => {
      if (e.target === this._element) {
        this.close();
      }
    });
  }

  open() {
    this._element.classList.add('modal_active');
  }

  close() {
    this._element.classList.remove('modal_active');
  }

  setContent(content: HTMLElement) {
    this._content.innerHTML = '';
    this._content.append(content);
  }

  get element(): HTMLElement {
    return this._element;
  }

  get isOpen(): boolean {
    return this._element.classList.contains('modal_active');
  }
}