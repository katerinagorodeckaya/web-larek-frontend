import './scss/styles.scss';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { App } from './components/base/App'; 
import { ProductModel } from './components/base/ProductModel';
import { OrderModel } from './components/base/OrderModel';
import { AppState } from './types/appState';

// Инициализация состояния
const initialState: AppState = {
  catalog: [],
  basket: [],
  order: null
};

const api = new Api('https://example.com/api');
const events = new EventEmitter();
const productModel = new ProductModel(api, initialState);
const orderModel = new OrderModel(api);

new App(events, productModel, orderModel);