import { IPreviewCardView } from "../../../types/index.ts";
import { Component } from "../../base/Component.ts";

export class PreviewCardView extends Component<IPreviewCardView> {
  private readonly titleElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly imageElement: HTMLImageElement;
  private readonly categoryElement: HTMLElement;
  private readonly descriptionElement: HTMLElement;


  constructor(template: HTMLTemplateElement) {
    const container = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    super(container);

    this.titleElement = container.querySelector(".card__title")!;
    this.priceElement = container.querySelector(".card__price")!;
    this.imageElement = container.querySelector(".card__image")!;
    this.categoryElement = container.querySelector(".card__category")!;
    this.descriptionElement = container.querySelector(".card__text")!;
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

  set description(description: string) {
    this.descriptionElement.textContent = description;
  }

  render(data: IPreviewCardView): HTMLElement {
    super.render(data);
    return this.container;
  }
}
