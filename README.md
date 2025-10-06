# Web-ларёк - Интернет-магазин для веб-разработчиков
Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных

View - слой представления, отвечает за отображение данных на странице

Presenter - содержит основную логику приложения и отвечает за связь представления и данных

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

Технологический стек:
TypeScript - строгая типизация
SCSS - стилизация компонентов
Webpack - сборка проекта
HTML5 - семантическая разметка

Структура проекта
src/components/base/        Базовые компоненты       
           
- api.ts            Класс для работы с API
- events.ts         Брокер событий
- component.ts      Базовый компонент

src/components/models/     Модели данных

- ProductModel.ts   Модель товаров
- BasketModel.ts    Модель корзины
- OrderModel.ts     Модель заказа
- ShopApi.ts        API магазина

src/components/view/      Компоненты представления

- BaseCard.ts       Базовая карточка
- CardCatalog.ts    Карточка товара в каталоге
- CardPreview.ts    Детальное представление товара
- CartItem.ts       Элемент корзины
- CartView.ts       Представление корзины
- Header.ts         Шапка приложения
- Gallery.ts        Галерея товаров
- ModalContainer.ts Контейнер модальных окон
- OrderAddressForm.ts Форма адреса и оплаты
- ContactsForm.ts   Форма контактов
- SuccessMessage.ts   Успешное оформление заказа

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

index.ts            Точка входа приложения


# Основные функции
- Просмотр каталога товаров

- Детальный просмотр товаров в модальном окне

- Добавление/удаление товаров из корзины

- Оформление заказа в два этапа:

- Выбор способа оплаты и адреса доставки

- Ввод контактных данных

- Подтверждение успешного оформления заказа

# Базовый код

Класс Component
Базовый класс для всех компонентов интерфейса.
```typescript
// Конструктор:
constructor(container: HTMLElement)

// Методы
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```
Модель товара
```typescript
render(data?: Partial<T>): HTMLElement - главный метод для отображения данных

setImage(element: HTMLImageElement, src: string, alt?: string): void - утилитарный метод для работы с изображениями
```

Класс Api
Содержит базовую логику отправки запросов.

```typescript
// Конструктор:
constructor(baseUrl: string, options: RequestInit = {})

// Методы
get<T extends object>(uri: string): Promise<T> - GET запрос

post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T> - POST/PUT/DELETE запрос
```

Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель".

```typescript
// Методы
on<T extends object>(event: EventName, callback: (data: T) => void): void - подписка на событие

emit<T extends object>(event: string, data?: T): void - инициализация события

off(eventName: EventName, callback: Subscriber): void - отписка от события
```
Интерфейс IProduct
```typescript
interface IProduct {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image?: string;
  category?: string;
}
```
Интерфейс IOrderForm
```typescript
interface IOrderForm {
  payment: "online" | "offline";
  email: string;
  phone: string;
  address: string;
}
```

Класс ProductModel
Управляет каталогом товаров.
```typescript
// Методы
setProductList(products: IProduct[]): void - сохранение списка товаров
getProductList(): IProduct[] - получение списка товаров
getProductById(id: string): IProduct | undefined - получение товара по ID
```

Класс BasketModel
Управляет корзиной покупок.
```typescript
// Методы
addToBasket(product: IProduct): void - добавление товара в корзину
removeFromBasket(id: string): void - удаление товара из корзины
getBasketCount(): number - количество товаров в корзине
getBasketTotal(): number - общая стоимость товаров
```

Класс OrderModel
Управляет данными заказа и валидацией.
```typescript
// Методы
validatePayment(): IValidationResult - валидация способа оплаты
validateAddress(): IValidationResult - валидация адреса
validateContacts(): IValidationResult - валидация контактов
getOrderData(): IOrderForm - получение данных заказа
```


# Слой коммуникации

Класс ShopApi
Отвечает за взаимодействие с сервером.
```typescript
// Методы
getProducts(): Promise<IProduct[]> - получение списка товаров
createOrder(order: IOrderForm & { items: string[]; total: number }): Promise<IOrder> - создание заказа
```

# Слой представления
Базовые компоненты
BaseCard
Базовый класс для карточек товаров.

CardCatalog
Карточка товара в каталоге с изображением, категорией, названием и ценой.

CardPreview
Детальное представление товара в модальном окне с кнопкой добавления/удаления из корзины.

CartItem
Элемент корзины с порядковым номером, названием, ценой и кнопкой удаления.

CartView
Представление корзины со списком товаров, общей стоимостью и кнопкой оформления заказа.

Формы заказа
OrderAddressForm
Форма для ввода адреса доставки и выбора способа оплаты.

OrderContactsForm
Форма для ввода email и телефона покупателя.

OrderSuccess
Сообщение об успешном оформлении заказа.

Вспомогательные компоненты
Header
Шапка приложения со счетчиком товаров в корзине.

Gallery
Контейнер для отображения каталога товаров.

ModalContainer
Универсальный контейнер для модальных окон.

# Функциональные возможности
Просмотр каталога товаров - отображение всех доступных товаров

Детальный просмотр товара - модальное окно с полной информацией о товаре

Управление корзиной - добавление/удаление товаров, отображение общей стоимости

Оформление заказа - двухэтапная форма с валидацией данных

Различные способы оплаты - онлайн или при получении

Адаптивный интерфейс - удобное отображение на разных устройствах


# События приложения
Приложение использует событийную модель для взаимодействия между компонентами:

product:select - выбор товара для просмотра

basket:add - добавление товара в корзину

basket:remove - удаление товара из корзины

basket:open - открытие корзины

order:open - открытие формы заказа

order:address:change - изменение адреса доставки

order:payment:change - изменение способа оплаты

order:contacts:submit - отправка данных контактов

modal:close - закрытие модального окна


# Особенности реализации
Четкое разделение ответственности между слоями MVP

Использование TypeScript для типобезопасности

Событийно-ориентированная архитектура

Модульная структура компонентов

Валидация форм на стороне клиента

Обработка ошибок при работе с API

Адаптивный дизайн

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
