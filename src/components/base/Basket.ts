import { EventEmitter } from './events';
import { IProduct } from '../../types/product';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class Basket {
  protected _element: HTMLElement;
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    protected template: HTMLTemplateElement,
    protected events: EventEmitter
  ) {
    this._element = cloneTemplate(template);
    this._list = ensureElement('.basket__list', this._element);
    this._total = ensureElement('.basket__price', this._element);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this._element);

    this.addEvents();
  }

  protected addEvents() {

    this._button.addEventListener('click', () => {
      this.events.emit('order:open'); 
    });

    this._list.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('basket__item-delete')) {
        const item = target.closest('.basket__item');
        const id = item?.getAttribute('data-id');
        if (id) {
          this.events.emit('item:removed', { id });
        }
      }
    });
  }

  updateItems(products: IProduct[], basketIds: string[]) {
    this._list.innerHTML = '';
    
    const basketProducts = products.filter(product => 
      basketIds.includes(product.id)
    );

    basketProducts.forEach((product, index) => {
      const itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
      const item = itemTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
      
      item.setAttribute('data-id', product.id);
      
      const indexEl = ensureElement('.basket__item-index', item);
      const titleEl = ensureElement('.card__title', item);
      const priceEl = ensureElement('.card__price', item);
      const deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', item);
      
      indexEl.textContent = (index + 1).toString();
      titleEl.textContent = product.title;
      priceEl.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
      deleteBtn.setAttribute('aria-label', `удалить ${product.title}`);
      
      this._list.appendChild(item);
    });

    this.updateTotal(basketProducts);
    this._button.disabled = basketProducts.length === 0;
  }

  protected updateTotal(products: IProduct[]) {
    const total = products.reduce((sum, product) => sum + (product.price || 0), 0);
    this._total.textContent = `${total} синапсов`;
  }

  get element(): HTMLElement {
    return this._element;
  }
}