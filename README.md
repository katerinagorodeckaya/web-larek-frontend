# Web-ларёк - Интернет-магазин для веб-разработчиков
SPA-приложение интернет-магазина с товарами для веб-разработчиков. Позволяет просматривать каталог, добавлять товары в корзину и оформлять заказы.

Технологический стек:
TypeScript - строгая типизация
SCSS - стилизация компонентов
Webpack - сборка проекта
HTML5 - семантическая разметка

Структура проекта
src/components/base/     Базовые компоненты       
           
-  api.ts           API-клиент
- events.ts         Система событий
- App.ts            Главный компонент приложения
- ProductModel.ts   Модель товаров
- OrderModel.ts     Модель заказов
- Page.ts           Компонент страницы
- ProductCard.ts    Карточка товара
- Modal.ts          Модальное окно
- Basket.ts         Корзина
- OrderForm.ts      Форма заказа
- ContactsForm.ts   Форма контактов
- SuccessMessage.ts Сообщение об успехе

types/              Типы TypeScript
- appState.ts       Состояние приложения
- events.ts         События
- order.ts          Типы заказов
- product.ts        Типы товаров

utils/              Утилиты
- constants.ts      Константы
- utils.ts          Вспомогательные функции

scss/               Стили
- styles.scss       Основные стили

index.ts            Точка входа


# Основные функции
- Просмотр каталога товаров

- Детальный просмотр товаров в модальном окне

- Добавление/удаление товаров из корзины

- Оформление заказа в два этапа:

- Выбор способа оплаты и адреса доставки

- Ввод контактных данных

- Подтверждение успешного оформления заказа

# Данные и типы данных
Базовые типы API
```typescript
// Ответ API для списка товаров
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};


// Методы для POST запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```
Модель товара
```typescript
export interface IProduct {
    id: string;
    title: string;
    price: number | null;  // Цена или null если товар недоступен
    description?: string;  // Описание товара
    image?: string;        // URL изображения
    category?: string;     // Категория: 'софт-скил', 'другое', 'хард-скил' и др.
}
```
Модель заказа
```typescript
export interface IOrderForm {
    payment: 'online' | 'offline';  // Способ оплаты
    email: string;                  // Email покупателя
    phone: string;                  // Телефон покупателя
    address: string;                // Адрес доставки
}

export interface IOrder extends IOrderForm {
    items: string[];  // Массив ID товаров в заказе
    total: number;    // Общая сумма заказа
}
```
Состояние приложения
```typescript
export interface AppState {
    catalog: IProduct[];  // Каталог всех товаров
    basket: string[];     // ID товаров в корзине
    order: IOrder | null; // Информация о текущем заказе
}
```
События приложения
```typescript
export enum Events {
    ITEM_ADDED = 'item:added',        // Товар добавлен в корзину
    ORDER_OPENED = 'order:opened',    // Начато оформление заказа
    ORDER_SUBMITTED = 'order:submitted', // Заказ отправлен на сервер
    MODAL_CLOSE = 'modal:close'       // Модальное окно закрыто
}
```
Компоненты интерфейса

ProductCard
Компонент карточки товара, используется в каталоге и в превью.
Особенности:
- Отображение изображения, названия, цены и категории
- Кнопка "В корзину"/"Убрать" в зависимости от состояния
- Клик по карточке открывает детальное превью

Modal
Универсальное модальное окно с затемнением фоном.
Функциональность:
- Закрытие по клику на крестик или вне области контента
- Блокировка прокрутки основного контента при открытии
- Поддержка различных типов контента

Basket
Компонент корзины товаров.
Отображает:
- Список товаров в корзине
- Общую сумму заказа
- Кнопку перехода к оформлению

OrderForm & ContactsForm
Формы для оформления заказа с валидацией полей.

# Модели данных (Model)

ProductModel - Модель товаров
Назначение: Управление данными товаров и их состоянием в приложении

Поля:
- state: AppState - текущее состояние приложения
- catalog: IProduct[] - каталог всех товаров
- basket: string[] - ID товаров в корзине

Методы:
- loadProducts(): Promise<IProduct[]> - загрузка товаров с сервера
- getProductById(id: string): IProduct | undefined - поиск товара по ID
- getBasketProducts(): IProduct[] - получение товаров в корзине
- clearBasket(): void - очистка корзины

OrderModel - Модель заказов
Назначение: Управление процессом оформления заказа и валидация данных

Методы:
- createOrder(order: IOrder): Promise<IOrder> - создание заказа на сервере
- validateOrder(order: Partial<IOrderForm>): string[] - валидация данных заказа
- validateEmail(email: string): boolean - проверка формата email
- validatePhone(phone: string): boolean - проверка формата телефона

# Представления (View)

ProductCard - Карточка товара
Назначение: Отображение товара в каталоге и модальном окне

Поля:
- _element: HTMLElement - DOM элемент карточки
- _image: HTMLImageElement - изображение товара
- _title: HTMLElement - название товара
- _price: HTMLElement - цена товара
- _category: HTMLElement - категория товара
- _button: HTMLButtonElement - кнопка действия
- _description: HTMLElement - описание товара (только в превью)

Методы:
- render() - отрисовка карточки с данными товара
- updateButton() - обновление состояния кнопки ("В корзину"/"Убрать")
- setInBasket(value: boolean) - установка состояния корзины
- addEvents() - добавление обработчиков событий

Basket - Корзина покупок
Назначение: Отображение и управление корзиной товаров

Поля:
- _element: HTMLElement - DOM элемент корзины
- _list: HTMLElement - контейнер списка товаров
- _total: HTMLElement - элемент общей суммы
- _button: HTMLButtonElement - кнопка оформления заказа

Методы:
- updateItems(products: IProduct[], basketIds: string[]) - обновление списка товаров
- updateTotal(products: IProduct[]) - расчет и отображение общей суммы
- addEvents() - добавление обработчиков событий

Modal - Модальное окно
Назначение: Универсальный контейнер для всплывающих окон

Поля:
- _element: HTMLElement - DOM элемент модального окна
- _closeButton: HTMLButtonElement - кнопка закрытия
- _content: HTMLElement - контейнер содержимого

Методы:
- open() - открытие модального окна
- close() - закрытие модального окна
- setContent(content: HTMLElement) - установка содержимого
- addEvents() - добавление обработчиков событий

OrderForm - Форма заказа
Назначение: Форма оформления заказа (шаг 1 - адрес и оплата)

Поля:
- _element: HTMLElement - DOM элемент формы
- _paymentButtons: HTMLButtonElement[] - кнопки выбора оплаты
- _addressInput: HTMLInputElement - поле ввода адреса
- _submitButton: HTMLButtonElement - кнопка отправки
- _errors: HTMLElement - контейнер ошибок

Методы:
- selectPayment(method: 'online' | 'offline') - выбор способа оплаты
- validate() - валидация формы
- submit() - отправка формы
- clear() - очистка формы

ContactsForm - Форма контактов
Назначение: Форма ввода контактных данных (шаг 2 - email и телефон)

Поля:
- _element: HTMLElement - DOM элемент формы
- _emailInput: HTMLInputElement - поле ввода email
- _phoneInput: HTMLInputElement - поле ввода телефона
- _submitButton: HTMLButtonElement - кнопка отправки
- _errors: HTMLElement - контейнер ошибок

Методы:
- validate() - валидация формы
- submit() - отправка формы
- clear() - очистка формы

SuccessMessage - Сообщение об успехе
Назначение: Отображение подтверждения успешного заказа

Поля:
- _element: HTMLElement - DOM элемент сообщения
- _title: HTMLElement - заголовок
- _description: HTMLElement - описание с суммой
- _closeButton: HTMLButtonElement - кнопка закрытия

Методы:
- setData(total: number) - установка данных о заказе
- addEvents() - добавление обработчиков событий

# Система событий

EventEmitter - Брокер событий
Назначение: Централизованная система управления событиями

Методы:
- on<T>(event: EventName, callback: (data: T) => void) - подписка на событие
- emit<T>(event: string, data?: T) - генерация события
- off(event: EventName, callback: Subscriber) - отписка от события
- onAll(callback: (event: EmitterEvent) => void) - подписка на все события

# Основные сценарии использования
1. Просмотр каталога товаров
- ProductModel загружает товары с сервера
- ProductCard отображает каждый товар в каталоге
- Пользователь может кликнуть на товар для просмотра деталей

2. Работа с корзиной
- При клике "В корзину" ProductCard генерирует событие ITEM_ADDED
- Basket обновляет список товаров и общую сумму
- ProductModel обновляет состояние корзины

3. Оформление заказа
- Basket открывает форму заказа при клике "Оформить"
- OrderForm валидирует данные адреса и оплаты
- ContactsForm валидирует контактные данные
- OrderModel отправляет заказ на сервер

4. Подтверждение заказа
- SuccessMessage отображает итоговую сумму
- ProductModel очищает корзину после успешного заказа

# Вспомогательные утилиты

Работа с DOM
- ensureElement() - гарантированное получение элемента
- ensureAllElements() - получение всех элементов
- cloneTemplate() - клонирование HTML шаблонов

Валидация и проверки
- isSelector() - проверка является ли строка селектором
- isEmpty() - проверка на пустое значение
- isPlainObject() - проверка на простой объект

BEM нейминг
bem() - генератор BEM классов

# Запуск и разработка
Установка зависимостей
```bash
npm install
```
Запуск в режиме разработки
```bash
npm run start
```
Сборка проекта
```bash
npm run build
```
# Особенности реализации
Событийная архитектура - компоненты общаются через систему событий

Разделение ответственности - четкое разделение на модели, компоненты и утилиты

TypeScript - полная типизация для надежности кода

Адаптивный дизайн - поддержка различных устройств

Валидация форм - проверка корректности вводимых данных

# Скрипты package.json
start - запуск dev-сервера с hot reload

build - сборка проекта для production

serve - запуск статического сервера для собранного проекта

Проект демонстрирует современный подход к разработке SPA-приложений с использованием TypeScript и компонентной архитектуры.