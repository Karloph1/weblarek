import { IOrderFormView, TPayment } from "../../../types";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export class OrderFormView extends Component<IOrderFormView> {
  private readonly events: IEvents;
  private readonly cardButton: HTMLButtonElement;
  private readonly cashButton: HTMLButtonElement;
  private readonly addressInput: HTMLInputElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    const container = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    super(container);

    this.events = events;
    this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = container.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement;

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
  }

  set payment(payment: TPayment) {
    this.cardButton.classList.toggle("button_alt-active", payment === "card");
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
  }

  set address(address: string) {
    this.addressInput.value = address;
  }

  render(data: Partial<IOrderFormView>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
