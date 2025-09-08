import { EventEmitter } from './events';
import { ProductModel } from './ProductModel';
import { OrderModel } from './OrderModel';
import { IProduct } from '../../types/product';
import { ProductCard } from './ProductCards';
import { Modal } from './Modal';
import { Basket } from './Basket';
import { OrderForm } from './OrderForm';
import { ContactsForm } from './ContactsForm';
import { SuccessMessage } from './SuccessMessage';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class Page {
  protected _gallery: HTMLElement;
  protected _basketButton: HTMLButtonElement;
  protected _modals: Modal[] = [];
  protected catalog: IProduct[] = [];
  protected basketComponent: Basket;
  protected orderFormComponent: OrderForm;
  protected contactsFormComponent: ContactsForm;
  protected successComponent: SuccessMessage;
  protected currentPreviewProduct: IProduct | null = null;

  constructor(
    protected events: EventEmitter,
    protected productModel: ProductModel,
    protected orderModel: OrderModel
  ) {
    this._gallery = ensureElement('.gallery');
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket');

    const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
    const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
    const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    const successTemplate = ensureElement<HTMLTemplateElement>('#success');

    this.basketComponent = new Basket(basketTemplate, this.events);
    this.orderFormComponent = new OrderForm(orderTemplate, this.events);
    this.contactsFormComponent = new ContactsForm(contactsTemplate, this.events);
    this.successComponent = new SuccessMessage(successTemplate, this.events);

    this.initModals();
    this.addEvents();
  }

  protected initModals() {
    this._modals = [
      new Modal(this.events, 'modal-preview'),
      new Modal(this.events, 'modal-basket'),
      new Modal(this.events, 'modal-order'),
      new Modal(this.events, 'modal-contacts'),
      new Modal(this.events, 'modal-success')
    ];

    this._modals[1].setContent(this.basketComponent.element);
    this._modals[2].setContent(this.orderFormComponent.element);
    this._modals[3].setContent(this.contactsFormComponent.element);
    this._modals[4].setContent(this.successComponent.element);
  }

  protected addEvents() {
    this._basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });

    this.events.on('products:loaded', (data: { catalog: IProduct[] }) => {
      this.catalog = data.catalog;
      this.renderProducts();
    });

    this.events.on('basket:changed', () => {
      this.renderProducts();
      this.updateBasketModal();
    });


    this.events.on('preview:update', () => {
      this.forceUpdatePreview();
    });

    this.events.on('basket:open', () => {
      this.updateBasketModal();
      this.openModal(1);
    });

    this.events.on('product:select', (data: { product: IProduct }) => {
      this.showProductPreview(data.product);
    });

    this.events.on('order:open', () => {
      this.openModal(2);
    });

    this.events.on('order:first:completed', () => {
      this.openModal(3);
    });

    this.events.on('order:success', (data: { total: number }) => {
      this.openModal(4);
    });

    this.events.on('success:close', () => {
      this.closeAllModals();
    });
  }

  protected renderProducts() {
    if (this.catalog.length === 0) return;
    
    this._gallery.innerHTML = '';
    const template = ensureElement<HTMLTemplateElement>('#card-catalog');

    this.catalog.forEach(product => {
      const isInBasket = this.productModel.state.basket.includes(product.id);
      const card = new ProductCard(template, this.events, product, isInBasket, false);
      this._gallery.appendChild(card.element);
    });
  }

  protected showProductPreview(product: IProduct) {
    const template = ensureElement<HTMLTemplateElement>('#card-preview');
    const isInBasket = this.productModel.state.basket.includes(product.id);
    const previewCard = new ProductCard(template, this.events, product, isInBasket, true);
    
    this.currentPreviewProduct = product;
    this._modals[0].setContent(previewCard.element);
    this.openModal(0);
  }


  protected forceUpdatePreview() {
    if (this.currentPreviewProduct && this._modals[0].isOpen) {

      this.showProductPreview(this.currentPreviewProduct);
    }
  }

  protected updateBasketModal() {
    const basketProducts = this.productModel.getBasketProducts();
    this.basketComponent.updateItems(basketProducts, this.productModel.state.basket);
  }

  protected openModal(index: number) {
    this.closeAllModals();
    if (this._modals[index]) {
      this._modals[index].open();
    }
  }

  protected closeAllModals() {
    this._modals.forEach(modal => {
      if (modal) {
        modal.close();
      }
    });
    this.currentPreviewProduct = null;
  }
}