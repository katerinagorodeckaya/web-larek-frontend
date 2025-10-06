import { BaseCard, IBaseCardData } from './BaseCard';
import { IEvents } from '../base/Events';
import { categoryClasses } from '../../utils/constants';

export interface ICardPreview extends IBaseCardData {
  image: string;
  category: keyof typeof categoryClasses;
  description: string;
  price: number | null;
}

export class CardPreview extends BaseCard<ICardPreview> {
  protected imageEl: HTMLImageElement;
  protected categoryEl: HTMLElement;
  protected priceEl: HTMLElement;
  protected descEl: HTMLElement;
  protected buttonEl: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    this.imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
    this.categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    this.descEl = this.container.querySelector('.card__text') as HTMLElement;
    this.buttonEl = this.container.querySelector('.card__button') as HTMLButtonElement;

    if (this.buttonEl) {
      this.buttonEl.addEventListener('click', (event) => {
        event.preventDefault();
        if (this.buttonEl.disabled) return;
        
        const id = this.container.dataset.id;
        if (id) {
          this.events.emit(this.buttonEl.textContent === 'Удалить из корзины' ? 'basket:remove' : 'basket:add', { id });
        }
      });
    }
  }

  updateCartState(inCart: boolean) {
    if (this.buttonEl) {
      this.buttonEl.textContent = inCart ? 'Удалить из корзины' : 'Купить';
      this.buttonEl.disabled = this.priceEl.textContent === 'Бесценно';
    }
  }

  set data(p: ICardPreview) {
    super.data = p;
    this.image = p.image;
    this.category = p.category;
    this.description = p.description;
    this.price = p.price;
  }

  set image(src: string) {
    const alt = this.titleEl?.textContent || '';
    this.setImage(this.imageEl, src, alt);
  }

  set category(value: keyof typeof categoryClasses) {
    this.categoryEl.className = 'card__category';
    this.categoryEl.classList.add(categoryClasses[value]);
    this.categoryEl.textContent = value;
  }

  set description(text: string) {
    this.descEl.textContent = text;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceEl.textContent = 'Бесценно';
      if (this.buttonEl) this.buttonEl.disabled = true;
    } else {
      this.priceEl.textContent = `${value} синапсов`;
      if (this.buttonEl) this.buttonEl.disabled = false;
    }
  }
}