# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами


## Архитектура (MVP + Event Bus)
### Модели (Model)
- **`ProductModel`**:
  - Загружает товары через API (`GET /product`)
  - Трансформирует данные в `IProduct[]`
  - Обновляет состояние `AppState.catalog`

- **`OrderModel`**:
  - Отправляет заказы (`POST /order`)
  - Валидирует данные формы (`IOrderForm`)
  - Возвращает результат типа `IOrder`

- **`AppState`**:
  - Хранит состояние:
    - `catalog: IProduct[]`
    - `basket: string[]`
    - `order: IOrder | null`

### Брокер событий
- **`EventEmitter`**:
  - Реализует паттерн Publisher/Subscriber
  - Методы:
    - `on(event, callback)`
    - `emit(event, data)`
    - `off(event, callback)`

### События
```typescript
export enum Events {
  ITEM_ADDED = 'item:added',
  ORDER_OPENED = 'order:opened',
  ORDER_SUBMITTED = 'order:submitted',
  MODAL_CLOSE = 'modal:close'
}
### Типы данных
Товары
typescript
export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  description?: string;
  image?: string;
  category?: string;
}
Заказы
typescript
export interface IOrderForm {
  payment: 'online' | 'offline';
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IOrderForm {
  items: string[];
  total: number;
}
API
Методы:

get<T>(uri): Promise<T>

post<T>(uri, data): Promise<T>

Примеры:

GET /product → { items: IProduct[] }

POST /order → IOrder

Установка и запуск
# Установка зависимостей
npm install
# или
yarn

# Запуск dev-сервера
npm run start
# или
yarn start

# Сборка проекта
npm run build
# или
yarn build

Взаимодействие компонентов
Загрузка товаров:
ProductModel → Api.get() → AppState.catalog

Добавление в корзину:
Пользователь → Events.ITEM_ADDED → App → AppState.basket

Оформление заказа:
Форма → OrderModel → Api.post() → IOrder

Планы по развитию
Реализация View:

Catalog

Basket

Modal

Валидация форм

Интеграция с REST API