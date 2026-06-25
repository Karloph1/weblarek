import { IBuyer, IOrderFormView, TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { FormView } from "./FormView";

export class OrderFormView extends FormView {
  private readonly cardButton: HTMLButtonElement;
  private readonly cashButton: HTMLButtonElement;
  private readonly addressInput: HTMLInputElement;
  private readonly nextButton: HTMLButtonElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      element,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      element,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      element,
    );
    this.nextButton = ensureElement<HTMLButtonElement>(
      ".order__button",
      element,
    );
    
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.cardButton.addEventListener("click", () => {
      this.events.emit("order.payment:change", {
        payment: "card",
      });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit("order.payment:change", {
        payment: "cash",
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order.address:change", {
        address: this.addressInput.value,
      });
    });

    this.nextButton.addEventListener("click", () => {
      this.events.emit("form.contacts:open");
    });
  }

  set payment(payment: TPayment) {
    this.cardButton.classList.toggle("button_alt-active", payment === "card");
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
  }

  set address(address: string) {
    this.addressInput.value = address;
  }

  set valid(error: Partial<Record<keyof IBuyer, string>>) {
    const payment = error.payment;
    const address = error.address;

    const isAllowed: Boolean = payment === undefined && address === undefined;

    this.events.emit("nextButton:change", {
      isAllowed: isAllowed,
      htmlButton: this.nextButton,
    });
  }


  render(data: Partial<IOrderFormView>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
