import { IBasketCardView } from "../../../types/index.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { CardView } from "./CardView.ts";

export class BasketCardView extends CardView {
  private readonly idElement: HTMLElement;
  private readonly buttonElement: HTMLButtonElement;

  constructor(element: HTMLElement, onClick: () => void) {
    super(element);

    this.idElement = ensureElement<HTMLButtonElement>(
      ".basket__item-index",
      element,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      element,
    );

    this.buttonElement.addEventListener("click", onClick);
  }

  set number(id: string) {
    this.idElement.textContent = id;
  }

  render(data: IBasketCardView): HTMLElement {
    super.render(data);
    return this.container;
  }
}
