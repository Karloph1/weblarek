import { IBasketButtonView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class BasketButtonView extends Component<IBasketButtonView> {
  private readonly basketCounter: HTMLElement;
  private readonly openButton: HTMLButtonElement;
  protected readonly events: IEvents;

  constructor(element: HTMLElement, events: IEvents) {
    super(element);
    this.events = events;

    this.basketCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      element,
    );
    this.openButton = ensureElement<HTMLButtonElement>(".header__basket");

    this.addEventListeners();
  }

  addEventListeners() {
    this.openButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(counter: number) {
    this.basketCounter.textContent = String(counter);
  }

  render(data: IBasketButtonView): HTMLElement {
    super.render(data);

    return this.container;
  }
}
