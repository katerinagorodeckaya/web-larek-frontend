import './scss/styles.scss';
import { Api } from './api';
import { EventEmitter } from './events';
import { App } from './App';
import { ProductModel } from './ProductModel';
import { OrderModel } from './OrderModel';
import { Page } from './Page';
import { AppState } from '../../types/appState';
import { API_URL } from '../../utils/constants';

// Инициализация состояния
const initialState: AppState = {
  catalog: [],
  basket: [],
  order: null
};

// Создание экземпляров
const api = new Api(API_URL);
const events = new EventEmitter();
const productModel = new ProductModel(api, initialState);
const orderModel = new OrderModel(api);

// Инициализация приложения
const app = new App(events, productModel, orderModel);
const page = new Page(events, productModel, orderModel);

// Глобальные обработчики ошибок
events.on('order:error', (data: { error: any }) => {
  console.error('Order error details:', data.error);
  alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
});

events.on('products:loaded', () => {
  console.log('Products loaded successfully');
});