import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import type { IEvents } from "./components/base/Events";

import { API_URL, CDN_URL, categoryMap } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";
import type { IProduct } from "./types/product";
import type { IOrderRequest } from "./types/order";

import { ShopApi } from "./components/models/ShopApi";
import { ProductModel } from "./components/models/ProductModel";
import { BasketModel } from "./components/models/BasketModel"; 
import { OrderModel } from "./components/models/OrderModel";

import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { ModalContainer } from "./components/view/ModalContainer";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CartItem } from "./components/view/CartItem";
import { CartView } from "./components/view/CartView";
import { OrderSuccess } from "./components/view/SuccessMessage.ts";
import { OrderAddressForm } from "./components/view/OrderAddressForm";
import { OrderContactsForm } from "./components/view/ContactsForm";

const events: IEvents = new EventEmitter();
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

const productModel = new ProductModel();
const basketModel = new BasketModel(); 
const orderModel = new OrderModel();

const page = ensureElement<HTMLElement>(".page");
const header = new Header(events, ensureElement<HTMLElement>(".header", page));
const gallery = new Gallery(events, page);
const modal = new ModalContainer(
  events,
  ensureElement<HTMLElement>(".modal", page)
);

let addressForm: OrderAddressForm | null = null;
let contactsForm: OrderContactsForm | null = null;
let isCartOpen = false;

function buildCatalogCard(p: IProduct): HTMLElement {
  const tplEl = ensureElement<HTMLTemplateElement>('#card-catalog');
  const root = cloneTemplate(tplEl);

  const card = new CardCatalog(events, root);
  return card.render({
    id: p.id,
    title: p.title,
    price: p.price,
    image: `${CDN_URL}${p.image}`,
    category: p.category as keyof typeof categoryMap,
  });
}

function buildCartRow(p: IProduct, index: number): HTMLElement {
  const tplEl = ensureElement<HTMLTemplateElement>('#card-basket');
  const li = cloneTemplate(tplEl);

  const row = new CartItem(events, li);
  return row.render({
    id: p.id,
    title: p.title,
    price: p.price as number,
    index: index + 1,
  });
}

function openPreview(product: IProduct) {
  const tplEl = ensureElement<HTMLTemplateElement>('#card-preview');
  const node = cloneTemplate(tplEl);

  const view = new CardPreview(events, node);

  view.data = {
    id: product.id,
    title: product.title,
    price: product.price,
    image: `${CDN_URL}${product.image}`,
    category: product.category as keyof typeof categoryMap,
    description: product.description || '',
  };

  view.updateCartState(basketModel.getProductAvailability(product.id)); 
  modal.content = node;
}

function openCart() {
  const tplEl = ensureElement<HTMLTemplateElement>('#basket');
  const node = cloneTemplate(tplEl);

  const cartView = new CartView(events, node);
  const rows = basketModel.getCartProductsList().map(buildCartRow); 

  cartView.items = rows;
  cartView.total = basketModel.getCartProductPrice();
  cartView.canSubmit = rows.length > 0;

  isCartOpen = true;
  modal.content = node;
}

function openOrderAddress() {
  const node = cloneTemplate<HTMLElement>('#order');
  addressForm = new OrderAddressForm(events, node);
  modal.content = addressForm.render({
    address: orderModel.address,
    payment: orderModel.payment,
    error: '',
    canSubmit: orderModel.validateAddress().valid && orderModel.validatePayment().valid,
  });
}

function openOrderContacts() {
  const node = cloneTemplate<HTMLElement>('#contacts');
  contactsForm = new OrderContactsForm(events, node);
  
  
  modal.content = contactsForm.render({
    email: orderModel.email,
    phone: orderModel.phone,
    error: '',
    canSubmit: orderModel.validateContacts().valid,
  });
}

function openOrderSuccess(total: number) {
  const tplEl = ensureElement<HTMLTemplateElement>("#success");
  const view = new OrderSuccess(cloneTemplate(tplEl), () => {
    modal.close();
  });

  view.total = total;
  modal.content = view.render({ total });
}

events.on('modal:close', () => {
  addressForm = null;
  contactsForm = null;
  isCartOpen = false;
});

events.on("basket:open", openCart);

events.on<{ id: string }>("product:select", ({ id }) => {
  const product = productModel.getItemById(id);
  if (product) openPreview(product);
});

events.on<{ id: string }>("basket:add", ({ id }) => {
  const product = productModel.getItemById(id);
  if (!product) return;
  if (product.price === null) return;
  if (basketModel.getProductAvailability(id)) return; 
  basketModel.addProductToCart(product); 
  header.counter = basketModel.getCartProductsList().length; 
});

events.on<{ id: string }>("basket:remove", ({ id }) => {
  basketModel.removeProductFromCart(id); 
  header.counter = basketModel.getCartProductsList().length; 
  if (isCartOpen) {
    openCart();
  }
});

events.on("order:open", openOrderAddress);

events.on('order:address:change', (payload: { value: string }) => {
  const { value } = payload;
  orderModel.address = value;
  const a = orderModel.validateAddress();
  const p = orderModel.validatePayment();

  if (!addressForm) return;
  addressForm.error = a.message || p.message || '';
  addressForm.canSubmit = a.valid && p.valid;
});

events.on('order:payment:change', (payload: { payment: 'online' | 'offline' }) => {
  const { payment } = payload;
  orderModel.payment = payment;
  const a = orderModel.validateAddress();
  const p = orderModel.validatePayment();

  if (!addressForm) return;
  addressForm.error = a.message || p.message || '';
  addressForm.canSubmit = a.valid && p.valid;
  addressForm.payment = orderModel.payment;
});

events.on('order:address:submit', () => {
  const a = orderModel.validateAddress();
  const p = orderModel.validatePayment();

  if (!addressForm) return;
  if (!a.valid || !p.valid) {
    addressForm.error = a.message || p.message || '';
    addressForm.canSubmit = false;
    return;
  }
  openOrderContacts();
});

events.on('order:email:change', (payload: { value: string }) => {
  const { value } = payload;
  orderModel.email = value;
  const c = orderModel.validateContacts();

  if (!contactsForm) return;
  contactsForm.error = c.message || '';
  contactsForm.canSubmit = c.valid;
});

events.on('order:phone:change', (payload: { value: string }) => {
  const { value } = payload;
  orderModel.phone = value;
  const c = orderModel.validateContacts();

  if (!contactsForm) return;
  contactsForm.error = c.message || '';
  contactsForm.canSubmit = c.valid;
});

events.on('order:contacts:submit', async () => {
  if (!orderModel.validateAll()) {
    return;
  }

  const items = basketModel.getCartProductsList().map(p => p.id); 
  const total = basketModel.getCartProductPrice(); 
  const { email, phone, address, payment } = orderModel.getUserData();

  const payload: IOrderRequest = { 
    items, 
    payment: payment as "online" | "offline", 
    address, 
    email, 
    phone, 
    total 
  };

  try {
    await shopApi.postOrder(payload);
    openOrderSuccess(total);
    basketModel.emptyCart(); 
    header.counter = 0;
    orderModel.resetUserData();
  } catch (e) {
    console.error('Order request failed:', e);
  }
});

shopApi
  .getProducts()
  .then((items) => {
    productModel.setProductList(items);
    const cards = items.map(buildCatalogCard);
    gallery.catalog = cards;
    header.counter = basketModel.getCartProductsList().length; 
  })
  .catch((err) => {
    console.error("Ошибка при получении товаров:", err);
  });