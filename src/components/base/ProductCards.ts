import { IProduct } from '../../types/product';
import { Events } from '../../types/events';
import { EventEmitter } from './events';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

export class ProductCard {
  protected _element: HTMLElement;
  protected _image: HTMLImageElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _button: HTMLButtonElement | null = null;
  protected _description: HTMLElement | null = null;
  protected inBasket: boolean = false;

  constructor(
    protected template: HTMLTemplateElement,
    protected events: EventEmitter,
    public product: IProduct,
    inBasket: boolean = false,
    protected isPreview: boolean = false
  ) {
    this.inBasket = inBasket;
    this._element = cloneTemplate(template);
    
    if (this.isPreview) {
      this._image = ensureElement<HTMLImageElement>('.card__image', this._element);
      this._title = ensureElement('.card__title', this._element);
      this._price = ensureElement('.card__price', this._element);
      this._category = ensureElement('.card__category', this._element);
      this._button = ensureElement<HTMLButtonElement>('.card__button', this._element);
      this._description = ensureElement('.card__text', this._element);
    } else {
      this._image = ensureElement<HTMLImageElement>('.card__image', this._element);
      this._title = ensureElement('.card__title', this._element);
      this._price = ensureElement('.card__price', this._element);
      this._category = ensureElement('.card__category', this._element);
    }

    this.render();
    this.addEvents();
  }

  protected render() {
    this._title.textContent = this.product.title;
    this._price.textContent = this.product.price ? `${this.product.price} синапсов` : 'Бесценно';
    
    if (this.product.image) {
      this._image.src = CDN_URL + this.product.image;
      this._image.alt = this.product.title;
    }

    if (this.product.category) {
      this._category.textContent = this.product.category;
      this._category.className = `card__category card__category_${this.getCategoryClass(this.product.category)}`;
    }

    if (this._description && this.product.description) {
      this._description.textContent = this.product.description;
    }

    if (this._button) {
      this.updateButton();
    }
  }

  protected getCategoryClass(category: string): string {
    const categoryMap: Record<string, string> = {
      'софт-скил': 'soft',
      'другое': 'other',
      'дополнительное': 'additional',
      'кнопка': 'button',
      'хард-скил': 'hard'
    };
    return categoryMap[category] || 'other';
  }

  public updateButton() {
    if (!this._button) return;

    if (this.inBasket) {
      this._button.textContent = 'Убрать';
      this._button.disabled = false;
    } else if (this.product.price === null) {
      this._button.textContent = 'Не продается';
      this._button.disabled = true;
    } else {
      this._button.textContent = 'В корзину';
      this._button.disabled = false;
    }
  }

  protected addEvents() {
    if (this._button) {
      this._button.addEventListener('click', () => {
        if (this.inBasket) {
          this.events.emit('item:removed', { id: this.product.id });
        } else {
          this.events.emit(Events.ITEM_ADDED, { id: this.product.id });
        }
      });
    }

    if (!this.isPreview) {
      this._element.addEventListener('click', (e) => {
        this.events.emit('product:select', { product: this.product });
      });
    }
  }

  public setInBasket(value: boolean) {
    this.inBasket = value;
    this.updateButton();
  }

  public get element(): HTMLElement {
    return this._element;
  }
}