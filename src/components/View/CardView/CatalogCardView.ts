import { ICatalogCardView } from "../../../types/index.ts";
import { Component } from "../../base/Component.ts";

export class CatalogCardView extends Component<ICatalogCardView> {
  private readonly titleElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly imageElement: HTMLImageElement;
  private readonly categoryElement: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    const container = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;
    super(container);

    this.titleElement = container.querySelector(".card__title")!;
    this.priceElement = container.querySelector(".card__price")!;
    this.imageElement = container.querySelector(".card__image")!;
    this.categoryElement = container.querySelector(".card__category")!;
  }

  set title(title: string) {
    this.titleElement.textContent = title;
  }

  set price(price: number | null) {
    this.priceElement.textContent =
      price === null ? "Бесценно" : `${price} синапсов`;
  }

  set image(image: string) {
    this.setImage(
      this.imageElement,
      image,
      this.titleElement.textContent || "",
    );
  }

  set category(category: string) {
    this.categoryElement.textContent = category;
  }

  render(data: ICatalogCardView): HTMLElement {
    super.render(data);
    return this.container;
  }
}
