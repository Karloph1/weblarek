import "./scss/styles.scss";
import { ProductCatalog } from "./components/Models/ProductCatalog";
import { apiProducts } from "./utils/data.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { CatalogCardView } from "./components/View/CardView/CatalogCardView.ts";
import { CatalogView } from "./components/View/CatalogView.ts";
import { PreviewCardView } from "./components/View/CardView/PreviewCardView.ts";
import { ModalView } from "./components/View/ModalView.ts";
import { Basket } from "./components/Models/Basket.ts";
import { BasketCardView } from "./components/View/CardView/BasketCardView.ts";
import { IProduct, TPayment } from "./types/index.ts";
import { BasketView } from "./components/View/BasketView.ts";
import { OrderFormView } from "./components/View/FormView/OrderFormView.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { ContactsFormView } from "./components/View/FormView/ContactsFormView.ts";

const events = new EventEmitter();
const gallery = document.querySelector(".gallery") as HTMLElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketButton = document.querySelector(".header__basket") as HTMLElement;
const catalogView = new CatalogView(gallery);
const productsModel = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

/*
templates.
*/
const cardTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;

const previewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;

const basketCardTemplate = document.querySelector(
  "#card-basket",
) as HTMLTemplateElement;

const orderFormTemplate = document.querySelector(
  "#order",
) as HTMLTemplateElement;

const contactsFormTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;

const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

const modalContainer = document.querySelector(
  "#modal-container",
) as HTMLElement;
const modal = new ModalView(modalContainer);

events.on("catalog:changed", () => {
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const card = new CatalogCardView(cardTemplate);

    const element = card.render({
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
    });

    console.log(element);

    element.addEventListener("click", () => {
      productsModel.setCurrentProduct(product);
      events.emit("preview:select", product);
    });

    return element;
  });

  catalogView.render({
    items: cards,
  });
});

/*
preview events.
*/
events.on("preview:select", () => {
  const currentProduct = productsModel.getCurrentProduct();

  if (currentProduct) {
    const card = new PreviewCardView(previewTemplate);

    const element = card.render({
      title: currentProduct.title,
      price: currentProduct.price,
      image: currentProduct.image,
      category: currentProduct.category,
      description: currentProduct.description,
    });

    const addButton = element.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    if (basket.isProductInBasket(currentProduct.id)) {
      addButton.textContent = "Удалить из корзины";
    }

    addButton.addEventListener("click", () => {
      if (addButton.textContent === "В корзину") {
        events.emit("preview:add");
      } else {
        events.emit("preview:delete");
      }
    });

    events.on("preview:added", () => {
      addButton.textContent = "Удалить из корзины";
    });

    events.on("preview:deleted", () => {
      addButton.textContent = "В корзину";
    });

    modal.content = element;
    modal.render({});
  }
});

events.on("preview:add", () => {
  const product: IProduct | null = productsModel.getCurrentProduct();

  if (product) {
    const basketCounter = document.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    const current = Number(basketCounter.textContent || 0);

    basketCounter.textContent = String(current + 1);
    basket.addProduct(product);
  }
});

events.on("preview:delete", () => {
  const product: IProduct | null = productsModel.getCurrentProduct();

  if (product) {
    const basketCounter = document.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    const current = Number(basketCounter.textContent || 0);

    basketCounter.textContent = String(current - 1);
    basket.deleteProduct(product);
  }
});

/*
basket events.
*/
basketButton.addEventListener("click", () => {
  events.emit("basket:select");
});

events.on("basket:select", () => {
  const products = basket.getProducts();
  let i = 1;
  const cards = products.map((product) => {
    const card = new BasketCardView(basketCardTemplate);

    const element = card.render({
      id: String(i),
      title: product.title,
      price: product.price,
    });
    i++;

    const deleteButton = element.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    deleteButton.addEventListener("click", () => {
      events.emit("basketElement:delete", product);
    });

    return element;
  });

  const basketView = new BasketView(basketTemplate);
  const basketElement = basketView.render({
    items: cards,
    total: basket.getGeneralPrice(),
  });

  const applyButton = basketElement.querySelector(
    ".basket__button",
  ) as HTMLButtonElement;
  applyButton.addEventListener("click", () => {
    events.emit("form.order:select");
  });

  modal.content = basketElement;
  modal.render({});
});

events.on("basketElement:delete", (product: IProduct) => {
  basket.deleteProduct(product);

  events.emit("basket:select");
});

/*
form.order events.
*/
events.on("form.order:select", () => {
  const form = new OrderFormView(orderFormTemplate, events);
  const { payment, address } = buyer.getBuyer();

  const element = form.render({
    payment: payment,
    address: address,
  });

  const nextButton = element.querySelector(
    ".order__button",
  ) as HTMLButtonElement;
  nextButton.addEventListener("click", () => {
    events.emit("form.contacts:select");
  });

  events.on("buyer.order:check", () => {
    const { payment, address } = buyer.validateBuyer();

    if (payment === undefined && address === undefined) {
      nextButton.removeAttribute("disabled");
    } else {
      nextButton.setAttribute("disabled", "disabled");
    }

    const errors = element.querySelector(".form__errors") as HTMLElement;
    const errorsObj = { payment, address };
    const errorMessages = Object.entries(errorsObj)
      .filter(([_, value]) => value !== undefined)
      .map(([_, value]) => `${value}`);

    errors.textContent = errorMessages.join("; ") || "";
  });

  modal.content = element;
  modal.render({});
});

events.on("order.payment:change", ({ payment }: { payment: TPayment }) => {
  buyer.setBuyerPayment(payment);

  events.emit("form.order:select");
  events.emit("buyer.order:check");
});

events.on("order.address:change", ({ address }: { address: string }) => {
  buyer.setBuyerAddress(address);
  events.emit("buyer.order:check");
});

/*
form.contacts events.
*/
events.on("form.contacts:select", () => {
  const form = new ContactsFormView(contactsFormTemplate, events);
  const { email, phone } = buyer.getBuyer();

  const element = form.render({
    email: email,
    phone: phone,
  });
  const nextButton = element.querySelector(".button") as HTMLButtonElement;
  nextButton.addEventListener("click", () => {
    events.emit("success:select");
  });

  events.on("buyer.contacts:check", () => {
    const { email, phone } = buyer.validateBuyer();
    if (email === undefined && phone === undefined) {
      nextButton.removeAttribute("disabled");
    } else {
      nextButton.setAttribute("disabled", "disabled");
    }

    const errors = element.querySelector(".form__errors") as HTMLElement;
    const errorsObj = { email, phone };
    const errorMessages = Object.entries(errorsObj)
      .filter(([_, value]) => value !== undefined)
      .map(([_, value]) => `${value}`);

    errors.textContent = errorMessages.join("; ") || "";
  });

  modal.content = element;
  modal.render({});
});

events.on("order.email:change", ({ email }: { email: string }) => {
  buyer.setBuyerEmail(email);

  events.emit("buyer.contacts:check");
});

events.on("order.phone:change", ({ phone }: { phone: string }) => {
  buyer.setBuyerPhone(phone);

  events.emit("buyer.contacts:check");
});

events.on("success:select", () => {
  const content = successTemplate.content.cloneNode(true) as DocumentFragment;
  const element = content.firstElementChild as HTMLElement;
  const basketPrice = element.querySelector(
    ".order-success__description",
  ) as HTMLElement;
  basketPrice.textContent = `Списано ${basket.getGeneralPrice()} синапсов`;

  const closeButton = element.querySelector(
    ".order-success__close",
  ) as HTMLButtonElement;

  closeButton.addEventListener("click", () => {
    modal.close();
  });

  basket.clearBasket();
  buyer.clearBuyer();
  modal.content = element;
  modal.render({});
});

productsModel.setProducts(apiProducts.items);
