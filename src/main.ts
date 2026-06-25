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
import {
  IApi,
  IBuyer,
  IOrderRequest,
  IOrderResult,
  IProduct,
  TPayment,
} from "./types/index.ts";
import { BasketView } from "./components/View/BasketView.ts";
import { OrderFormView } from "./components/View/FormView/OrderFormView.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { ContactsFormView } from "./components/View/FormView/ContactsFormView.ts";
import { cloneTemplate } from "./utils/utils.ts";
import { SuccessView } from "./components/View/SuccessView.ts";
import { CommunicationLayer } from "./components/CommunicationLayer.ts";
import { BasketButtonView } from "./components/View/BasketButtonView.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";

const events = new EventEmitter();
const gallery = document.querySelector(".gallery") as HTMLElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basketButton = document.querySelector(
  ".header__basket",
) as HTMLButtonElement;
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
events.on("catalog:init", () => {
  basket.clearBasket();
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const card = new CatalogCardView(cloneTemplate(cardTemplate), events);

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

events.on("preview:show", () => {
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
        buttonText: "Нельзя приобрести",
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
        });
      }
    }

    modal.content = element;
    modal.render({});
  }
});

events.on(
  "previewButton:check",
  (data: { htmlButton: HTMLButtonElement; price: string }) => {
    if (data.price === "Бесценно") {
      data.htmlButton.setAttribute("disabled", "disabled");
    } else {
      data.htmlButton.removeAttribute("disabled");
    }
  },
);

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
  const products = basket.getProducts();
  let i = 1;
  const cards = products.map((product) => {
    const card = new BasketCardView(cloneTemplate(basketCardTemplate), events);

    const element = card.render({
      id: product.id,
      number: String(i),
      title: product.title,
      price: product.price,
    });
    i++;

    return element;
  });

  const basketElement = basketView.render({
    items: cards,
    total: basket.getGeneralPrice(),
    purchasable: basket.getProductsAmount(),
  });

  modal.content = basketElement;
  modal.render({});
});

events.on(
  "basketButton:check",
  (data: { isAllowed: boolean; htmlButton: HTMLButtonElement }) => {
    if (!data.isAllowed) {
      data.htmlButton.setAttribute("disabled", "disabled");
    } else {
      data.htmlButton.removeAttribute("disabled");
    }
  },
);

events.on("basketSize:change", () => {
  const basketCounter = document.querySelector(
    ".header__basket-counter",
  ) as HTMLElement;

  basketCounter.textContent = String(basket.getProductsAmount());
});

events.on("basketElement:delete", (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);

  if (product !== undefined) {
    basket.deleteProduct(product);
    events.emit("basket:open");
  }
});

/*
buyer events
*/
events.on("buyer:change", () => {
  const _buyer = buyer.getBuyer();
  const errors = buyer.validateBuyer();

  const orderErrors = {
    payment: errors.payment,
    address: errors.address,
  };
  const contactsErrors = {
    email: errors.email,
    phone: errors.phone,
  };

  ((orderFormView.payment = _buyer.payment),
    (orderFormView.address = _buyer.address),
    (orderFormView.valid = orderErrors));
  orderFormView.error = orderErrors;

  ((contactsFormView.email = _buyer.email),
    (contactsFormView.phone = _buyer.phone),
    (contactsFormView.valid = contactsErrors));
  contactsFormView.error = contactsErrors;
});

events.on(
  "errors:show",
  (data: {
    errors: Partial<Record<keyof IBuyer, string>>;
    errorText: HTMLElement;
  }) => {
    const errorMessages = Object.values(data.errors).filter((value) => {
      if (value !== undefined) {
        return value;
      }
    });

    data.errorText.textContent = String(errorMessages);
  },
);

/*
form.order events.
*/
events.on("form.order:open", () => {
  const _buyer = buyer.getBuyer();
  const errors = Object.fromEntries(
    Object.entries(buyer.validateBuyer()).filter(([key, _]) => {
      return key === "payment" || key === "address";
    }),
  );

  const element = orderFormView.render({
    payment: _buyer.payment,
    address: _buyer.address,
    valid: errors,
    error: errors,
  });

  modal.content = element;
  modal.render({});
});

events.on(
  "nextButton:change",
  (data: { isAllowed: boolean; htmlButton: HTMLButtonElement }) => {
    if (data.isAllowed) {
      data.htmlButton.removeAttribute("disabled");
    } else {
      data.htmlButton.setAttribute("disabled", "disabled");
    }
  },
);

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
  const errors = Object.fromEntries(
    Object.entries(buyer.validateBuyer()).filter(([key, _]) => {
      return key === "email" || key === "phone";
    }),
  );

  const element = contactsFormView.render({
    email: email,
    phone: phone,
    valid: errors,
    error: errors,
  });

  modal.content = element;
  modal.render({});
});

events.on(
  "submitButton:change",
  (data: { isAllowed: boolean; htmlButton: HTMLButtonElement }) => {
    if (data.isAllowed) {
      data.htmlButton.removeAttribute("disabled");
    } else {
      data.htmlButton.setAttribute("disabled", "disabled");
    }
  },
);

events.on("order.email:change", ({ email }: { email: string }) => {
  buyer.setBuyerEmail(email);
});

events.on("order.phone:change", ({ phone }: { phone: string }) => {
  buyer.setBuyerPhone(phone);
});

events.on("success:open", () => {
  const element = successView.render({
    price: basket.getGeneralPrice(),
  });

  modal.content = element;
  modal.render({});
});

events.on("success:close", () => {
  sendOrder();
  

  basket.clearBasket();
  buyer.clearBuyer();
  modal.close();
});

function sendOrder() {
  const { payment, address, email, phone } = buyer.getBuyer();

  const finalOrder: IOrderRequest = {
    payment: payment,
    email: email,
    phone: phone,
    address: address,
    items: basket.getProducts().map((product) => product.id),
    total: basket.getGeneralPrice(),
  };
  


  communicationLayer.submitOrder(finalOrder)
    .then((orderResult: IOrderResult) => {
      console.log('Заказ оформлен, номер:', orderResult.id);
    })
    .catch((error) => {
      console.error('Не удалось отправить заказ:', error);
    });
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


