import { ISuccessView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class SuccessView extends Component<ISuccessView> {
  private readonly events: IEvents;
  private readonly priceElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.priceElement = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );

    this.addEventListeners();
  }

  addEventListeners() {
    this.closeButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set price(price: number) {
    this.priceElement.textContent = `Списано ${price} синапсов`;
  }

  render(data: Partial<ISuccessView>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
