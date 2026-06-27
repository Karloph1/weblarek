import "./scss/styles.scss";
import { ProductCatalog } from "./components/Models/ProductCatalog";
import { EventEmitter } from "./components/base/Events.ts";
import { CatalogCardView } from "./components/View/CardView/CatalogCardView.ts";
import { CatalogView } from "./components/View/CatalogView.ts";
import { PreviewCardView } from "./components/View/CardView/PreviewCardView.ts";
import { ModalView } from "./components/View/ModalView.ts";
import { Basket } from "./components/Models/Basket.ts";
import { BasketCardView } from "./components/View/CardView/BasketCardView.ts";
import { IOrderRequest, IProduct, TPayment } from "./types/index.ts";
import { BasketView } from "./components/View/BasketView.ts";
import { OrderFormView } from "./components/View/FormView/OrderFormView.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { ContactsFormView } from "./components/View/FormView/ContactsFormView.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { SuccessView } from "./components/View/SuccessView.ts";
import { CommunicationLayer } from "./components/CommunicationLayer.ts";
import { BasketButtonView } from "./components/View/BasketButtonView.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";

const events = new EventEmitter();
const gallery = ensureElement<HTMLElement>(".gallery");
const basketButton = ensureElement<HTMLButtonElement>(".header__basket");
const productsModel = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

/*
templates.
*/
const cardTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const previewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketCardTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderFormTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsFormTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const modalContainer = ensureElement<HTMLElement>("#modal-container");

/*
views
*/
const catalogView = new CatalogView(gallery);
const modal = new ModalView(modalContainer);
const previewCardView = new PreviewCardView(
  cloneTemplate(previewTemplate),
  events,
);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderFormView = new OrderFormView(
  cloneTemplate(orderFormTemplate),
  events,
);
const contactsFormView = new ContactsFormView(
  cloneTemplate(contactsFormTemplate),
  events,
);
const successView = new SuccessView(cloneTemplate(successTemplate), events);
const basketButtonView = new BasketButtonView(basketButton, events);

/*
catalog events.
*/
events.on("catalog:changed", () => {
  basket.clearBasket();
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const card = new CatalogCardView(cloneTemplate(cardTemplate), () =>
      events.emit("preview:select", { id: product.id }),
    );

    const imageInfo = {
      src: product.image,
      alt: product.title,
    };

    const element = card.render({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imageInfo,
      category: product.category,
    });

    return element;
  });

  catalogView.render({
    items: cards,
  });

  basketButtonView.render({
    counter: basket.getProductsAmount(),
  });
});

/*
preview events.
*/
events.on("preview:select", ({ id }: { id: string }) => {
  const product: IProduct | undefined = productsModel.getProductById(id);

  if (product !== undefined) {
    productsModel.setCurrentProduct(product);
  }
});

events.on("preview:changed", () => {
  const currentProduct = productsModel.getCurrentProduct();

  if (currentProduct) {
    const imageInfo = {
      src: currentProduct.image,
      alt: currentProduct.title,
    };

    let element: HTMLElement;
    if (currentProduct.price === null) {
      element = previewCardView.render({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        image: imageInfo,
        category: currentProduct.category,
        description: currentProduct.description,
        buttonText: "Недоступно",
        buttonDisabled: true,
      });
    } else {
      if (basket.isProductInBasket(currentProduct.id)) {
        element = previewCardView.render({
          id: currentProduct.id,
          title: currentProduct.title,
          price: currentProduct.price,
          image: imageInfo,
          category: currentProduct.category,
          description: currentProduct.description,
          buttonText: "Удалить из корзины",
          buttonDisabled: false,
        });
      } else {
        element = previewCardView.render({
          id: currentProduct.id,
          title: currentProduct.title,
          price: currentProduct.price,
          image: imageInfo,
          category: currentProduct.category,
          description: currentProduct.description,
          buttonText: "В корзину",
          buttonDisabled: false,
        });
      }
    }

    modal.content = element;
    modal.render({});
  }
});

events.on("previewButton:change", () => {
  const cur = productsModel.getCurrentProduct();

  if (cur !== null) {
    if (basket.isProductInBasket(cur.id)) {
      basket.deleteProduct(cur);
    } else {
      basket.addProduct(cur);
    }
  }

  modal.close();
});

/*
basket events.
*/
events.on("basket:open", () => {
    modal.content = basketView.render();
    modal.render({});
});

events.on("basketSize:change", () => {
  const products = basket.getProducts();

  const cards = products.map((product, index) => {
    const card = new BasketCardView(cloneTemplate(basketCardTemplate), () =>
      events.emit("basketElement:delete", { id: product.id }),
    );

    return card.render({
      id: product.id,
      number: String(index + 1),
      title: product.title,
      price: product.price,
    });
  });

  basketView.render({
    items: cards,
    total: basket.getGeneralPrice(),
    buttonDisabled: basket.getProductsAmount() === 0,
  });

  basketButtonView.render({
    counter: basket.getProductsAmount(),
  });
});

events.on("basketElement:delete", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);

  if (product !== undefined) {
    basket.deleteProduct(product);
  }
});

/*
buyer events
*/
events.on("buyer:change", () => {
  const _buyer = buyer.getBuyer();
  const errors = buyer.validateBuyer();

  const orderErrors =
    errors.payment !== undefined
      ? errors.address !== undefined
        ? errors.payment + ", " + errors.address
        : errors.payment
      : errors.address !== undefined
        ? errors.address
        : "";

  const contactsErrors =
    errors.email !== undefined
      ? errors.phone !== undefined
        ? errors.email + ", " + errors.phone
        : errors.email
      : errors.phone !== undefined
        ? errors.phone
        : "";

  ((orderFormView.payment = _buyer.payment),
    (orderFormView.address = _buyer.address),
    (orderFormView.valid = !errors.payment && !errors.address));
  orderFormView.error = orderErrors;

  ((contactsFormView.email = _buyer.email),
    (contactsFormView.phone = _buyer.phone),
    (contactsFormView.valid = !errors.email && !errors.phone));
  contactsFormView.error = contactsErrors;
});

/*
form.order events.
*/
events.on("form.order:open", () => {
  const _buyer = buyer.getBuyer();
  const errors = buyer.validateBuyer();

  const orderErrors =
    errors.payment !== undefined
      ? errors.address !== undefined
        ? errors.payment + ", " + errors.address
        : errors.payment
      : errors.address !== undefined
        ? errors.address
        : "";

  const element = orderFormView.render({
    payment: _buyer.payment,
    address: _buyer.address,
    valid: !errors.payment && !errors.address,
    error: orderErrors,
  });

  modal.content = element;
  modal.render({});
});

events.on("order.payment:change", ({ payment }: { payment: TPayment }) => {
  buyer.setBuyerPayment(payment);
});

events.on("order.address:change", ({ address }: { address: string }) => {
  buyer.setBuyerAddress(address);
});

/*
form.contacts events.
*/
events.on("form.contacts:open", () => {
  const { email, phone } = buyer.getBuyer();
  const errors = buyer.validateBuyer();

  const contactsErrors =
    errors.email !== undefined
      ? errors.phone !== undefined
        ? errors.email + ", " + errors.phone
        : errors.email
      : errors.phone !== undefined
        ? errors.phone
        : "";

  const element = contactsFormView.render({
    email: email,
    phone: phone,
    valid: !errors.email && !errors.phone,
    error: contactsErrors,
  });

  modal.content = element;
  modal.render({});
});

events.on("order.email:change", ({ email }: { email: string }) => {
  buyer.setBuyerEmail(email);
});

events.on("order.phone:change", ({ phone }: { phone: string }) => {
  buyer.setBuyerPhone(phone);
});

/*
success events.
*/
events.on("success:close", () => {
  basket.clearBasket();
  buyer.clearBuyer();
  modal.close();
});

events.on("contacts:submit", () => {
  communicationLayer
    .submitOrder(buildOrder())
    .then((orderResult) => {
      basket.clearBasket();
      buyer.clearBuyer();
      successView.render({ price: orderResult.total });
      modal.render({ content: successView.render() });
    })
    .catch((error) => console.error(error));
});

function buildOrder(): IOrderRequest {
  const { payment, address, email, phone } = buyer.getBuyer();

  const finalOrder: IOrderRequest = {
    payment: payment,
    email: email,
    phone: phone,
    address: address,
    items: basket.getProducts().map((product) => product.id),
    total: basket.getGeneralPrice(),
  };

  return finalOrder;
}

const api = new Api(API_URL);
const communicationLayer = new CommunicationLayer(api);

communicationLayer
  .fetchProducts()
  .then((response) => {
    const { items } = response;
    productsModel.setProducts(items);
  })
  .catch((error) => {
    console.error("Ошибка загрузки продуктов:", error);
  });
