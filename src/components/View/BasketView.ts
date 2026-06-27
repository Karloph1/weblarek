import { IBasketView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class BasketView extends Component<IBasketView> {
  private readonly listElement: HTMLUListElement;
  private readonly priceElement: HTMLElement;
  private readonly formButton: HTMLButtonElement;
  protected readonly events: IEvents;

  constructor(element: HTMLElement, events: IEvents) {
    super(element);
    this.events = events;

    this.listElement = ensureElement<HTMLUListElement>(
      ".basket__list",
      element,
    );
    this.priceElement = ensureElement<HTMLElement>(".basket__price", element);
    this.formButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      element,
    );

    this.addEventListeners();
  }

  addEventListeners() {
    this.formButton.addEventListener("click", () => {
      this.events.emit("form.order:open");
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(total: number) {
    this.priceElement.textContent = `${total} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.formButton.disabled = value;
  }

  render(data?: IBasketView): HTMLElement {
    super.render(data);

    return this.container;
  }
}
