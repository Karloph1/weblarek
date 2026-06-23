# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс IProduct

Содержит в себе информацию о продукте.

Поля класса:
`id: string` - айди предмета.
`description: string` - описание предмета.
`image: string` - изображение предмета.
`title: string` - название предмета.
`category: string` - категории предмета.
`price: number | null` - цена предмета. В некоторых случаях цены может не быть.

#### Интерфейс IBuyer

Содержит в себе информацию о покупателе.

Поля класса:
`payment: TPayment` - тип оплаты покупателя.
`email: string` - электронная почта покупателя.
`phone: string` - телефон покупателя.
`address: string` - адрес покупателя.

### Модели данные

#### Класс ProductCatalog

Содержит в себе информацию о каталоге предметов.

Поля класса:
`products: IProduct[]` - массив всех товаров.
`currentProduct: IProduct` - товар, выбранный для подробного отображения.

Методы класса:
`setProducts(products: IProduct[]): void` - сохранение массива товаров полученного в параметрах метода.
`getProducts(): IProduct[]` - получение массива товаров из модели.
`getProductById(id: string): IProduct | undefined` - получение одного товара по его id.
`setCurrentProduct(product: IProduct): void` - сохранение товара для подробного отображения.
`getCurrentProduct(): IProduct | undefined` - получение товара для подробного отображения.

#### Класс Basket

Содержит в себе информацию о корзине покупок.

Поля класса:
`products: IProduct[]` - массив купленных покупателем товаров.

Методы класса:
`getProducts(): IProduct[]` - получение массива товаров, которые находятся в корзине.
`addProduct(product: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины.
`deleteProduct(product: IProduct): void` - удаление товара, полученного в параметре из массива корзины.
`clearBasket(): void` - очистка корзины.
`getGeneralPrice(): number` - получение стоимости всех товаров в корзине.
`getProductsAmount(): number` - получение количества товаров в корзине.
`isProductInBasket(id: string): boolean` - проверка наличия товара в корзине по его id, полученного в параметр метода.

#### Класс Buyer

Содержит в себе информацию о продавце.

Поля класса:
`payment: TPayment` - тип оплаты покупателя.
`email: string` - электронная почта покупателя.
`phone: string` - телефон покупателя.
`address: string` - адрес покупателя.

Методы класса:
`setBuyer(payment?: TPayment, email?: string, phone?: string, address?: string): void` = сохранение данных в модели. Присутствует возможность сохранить только одно значение,не удалив при этом значения других полей, которые уже могут храниться в классе
`getBuyer(): Basket` - получение всех данных покупателя.
`deleteBuyer(): void` - очистка данных покупателя.
`validateBuyer(): {field: string, message: string}` - валидация данных.

### Слой коммуникации.

#### Класс communicationLayer

Содержит в себе информацию о работе с api сервера.

Методы класса:
`get<T extends object>(uri: string)` - запрос на сервер для получения объекта с массивом товаров.
`post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST')` - отправка на сервер данных о покупателе и выбранных товарах


### Слой представления (View)
#### Класс CatalogCardView
Является классом представления карточки в списке

Поля класса: 
`titleElement: HTMLElement` - html элемент заголовка
`priceElement: HTMLElement` - html элемент цены
`imageElement: HTMLImageElement` - html элемент картинки
`categoryElement: HTMLElement` - html элемент категории

Методы класса:
`set title(title: string): void` - устанавливает заголовок карточки
`set price(price: number | null): void` - устанавливает цену карточки
`set image(image: string): void` - устанавливает изобржание карточки
`set category(category: string): void` - устанавливает категорию карточки
`render(data: IBasketCardView): HTMLElement` - рендерит карточку на экране


#### Класс PreviewCardView
Является классом представления описания карточки 

Поля класса:
`titleElement: HTMLElement` - html элемент заголовка
`priceElement: HTMLElement` - html элемент цены
`imageElement: HTMLImageElement` - html элемент картинки
`categoryElement: HTMLElement` - html элемент категории
`descriptionElement: HTMLElement` - html элемент описания

Методы класса:
`set title(title: string): void` - устанавливает заголовок карточки
`set price(price: number | null): void` - устанавливает цену карточки
`set image(image: string): void` - устанавливает изобржание карточки
`set category(category: string): void` - устанавливает категорию карточки
`set description(description: string): void` - устанавливает описание карточки
`render(data: IBasketCardView): HTMLElement` - рендерит карточку на экране


#### Класс BasketCardView
Является классом представления карточки в корзине

Поля класса:
`idElement: HTMLElement` - html элемент id
`titleElement: HTMLElement` - html элемент заголовка
`priceElement: HTMLElement` - html элемент цены

Методы класса:
`set id(id: string): void` - устанавливает id карточки
`set title(title: string): void` - устанавливает заголовок карточки
`set price(price: number | null): void` - устанавливает цену карточки
`render(data: IBasketCardView): HTMLElement` - рендерит карточку на экране


#### Класс OrderFormView
Является классом представления формы заказа

Поля класса:
`events: IEvents` - обрабатываеме события 
`cardButton: HTMLButtonElement` - кнопка выбора оплаты онлайн
`cashButton: HTMLButtonElement` - кнопка выбора оплаты деньгами
`addressInput: HTMLInputElement` - html элемент ввода адреса

Методы класса:
`addEventListeners(): void` - поставить слушателей на события ввода данных
`set payment(payment: TPayment): void` - устанавливает тип оплаты покупателя
`set address(address: string): void` - устанавливает адресс покупателя
`render(data: Partial<IContactsFormView>): HTMLElement` - рендерит информацию на экране


#### Класс ContactsFormView
Является классом представления формы контактов

Поля класса:
`events: IEvents` - обрабатываеме события 
`emailInput: HTMLInputElement` - html элемент ввода электронной почты
`phoneInput: HTMLInputElement` - html элемент ввода телефона

Методы класса:
`addEventListeners(): void` - поставить слушателей на события ввода данных
`set email(email: string): void` - устанавливает электронную почту покупателя
`set phone(phone: string): void` - устанавливает номер телефона покупателя
`render(data: Partial<IContactsFormView>): HTMLElement` - рендерит информацию на экране


#### Класс ModalView
Является классом представления модального окна

Поля класса:
`closeButton: HTMLButtonElement` - кнопка закрытия окна
`contentContainer: HTMLElement` - html элемент контейнера окна

Методы класса:
`set content(content: HTMLElement)` - 
`open(): void` - открыть модальное окно
`close(): void` - закрыть модальное окно
`render(data: Partial<IModalView>): HTMLElement` - рендерит модальное окно на экране


#### Класс CatalogView
Является классом представления каталога

Методы класса:
`set items(items: HTMLElement[])` - устанавливает предметы в каталоге


#### Класс BasketView 
Является классом представления корзины

Поля класса:
`listElement: HTMLUListElement` - html элемент списка карточков
`priceElement: HTMLElement` - html элемент цены карточки

Методы класса:
`render(data: IBasketView): HTMLElement` - рендер списка карточек на экран

#### Генерируемые события 
`catalog:changed` - изменения в каталоге
`preview:select` - показ текущего элемента
`preview:add` - добавить текущий элемент в корзину
`preview:delete` - удалить текущий элемент из корзины
`preview:added` - отобразить статус текущего элемента, что он добавлен в корзину
`preview:deleted` - отобразить статус текущего элемента, что он удален из корзины
`basket:select` - открытие корзиные
`basketElement:delete` - удалить карточку из корзины
`form.order:select` - показ данных заказа
`buyer.order:check` - проверка заполненности данных заказа
`order.payment:change` - изменение типа оплаты
`order.address:change` - изменение адреса
`form.contacts:select` - показ контактных данных покупателя
`buyer.contacts:check` - проверка заполненности данных покупателя
`order.email:change` - изменение email
`order.phone:change` - изменение телефона
`success:select` - - открытие окна успешно выполненной покупки

#### Класс Presenter