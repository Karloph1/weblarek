import { IBasketCardView } from "../../../types/index.ts";
import { Component } from "../../base/Component.ts";

export class BasketCardView extends Component<IBasketCardView> {
  private readonly idElement: HTMLElement;
  private readonly titleElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  
  constructor(template: HTMLTemplateElement) {
    const container = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

    super(container);

    this.idElement = container.querySelector(".basket__item-index")!;
    this.titleElement = container.querySelector(".card__title")!;
    this.priceElement = container.querySelector(".card__price")!;
  }
  
  set id(id: string) {
    this.idElement.textContent = id;
  }

  set title(title: string) {
    this.titleElement.textContent = title;
  }

  set price(price: number | null) {
    this.priceElement.textContent =
      price === null
        ? "Бесценно"
        : `${price} синапсов`;
  }

  render(data: IBasketCardView): HTMLElement {
    super.render(data);
    return this.container;
  }
}
