import { ICardView } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export abstract class CardView extends Component<ICardView> {
  protected readonly events: IEvents;
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element);
    this.events = events;
    this.titleElement = ensureElement<HTMLButtonElement>(
      ".card__title",
      element,
    );
    this.priceElement = ensureElement<HTMLButtonElement>(
      ".card__price",
      element,
    );
  }

  set title(title: string) {
    this.titleElement.textContent = title;
  }

  set price(price: number | null) {
    this.priceElement.textContent =
      price === null ? "Бесценно" : `${price} синапсов`;
  }

  render(data: Partial<ICardView>): HTMLElement {
        super.render(data);
        return this.container;
    }
}
