import { IBasketView } from "../../types";
import { Component } from "../base/Component";

export class BasketView extends Component<IBasketView> {
  protected listElement: HTMLUListElement;
  protected priceElement: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    super(template.content.cloneNode(true) as HTMLElement);

    this.listElement = this.container.querySelector('.basket__list') as HTMLUListElement;
    this.priceElement = this.container.querySelector('.basket__price') as HTMLElement;
  }

  render(data: IBasketView): HTMLElement {
    this.listElement.replaceChildren(...data.items);
    this.priceElement.textContent = `${data.total} синапсов`;

    return this.container;
  }
}