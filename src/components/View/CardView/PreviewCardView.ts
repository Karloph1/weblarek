import { IPreviewCardView, TCategory } from "../../../types/index.ts";
import { categoryMap, CDN_URL } from "../../../utils/constants.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events";
import { CardView } from "./CardView.ts";

export class PreviewCardView extends CardView {
  private readonly imageElement: HTMLImageElement;
  private readonly categoryElement: HTMLElement;
  private readonly descriptionElement: HTMLElement;
  private readonly basketButton: HTMLButtonElement;
  private events: IEvents;

  constructor(element: HTMLElement, events: IEvents) {
    super(element);
    this.events = events;

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      element,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      element,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      element,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      element,
    );

    this.addEventListeners();
  }

  addEventListeners() {
    this.basketButton.addEventListener("click", () => {
      this.events.emit("previewButton:change");
    });
  }

  set image(imageInfo: { src: string; alt: string }) {
    this.setImage(this.imageElement, CDN_URL + imageInfo.src, imageInfo.alt);
  }

  set category(category: TCategory) {
    Array.from(this.categoryElement.classList).forEach((className) => {
      if (className.startsWith("card__category_")) {
        this.categoryElement.classList.remove(className);
      }
    });

    this.categoryElement.classList.add(categoryMap[category]);
    this.categoryElement.textContent = category;
  }

  set description(description: string) {
    this.descriptionElement.textContent = description;
  }

  set buttonText(text: string) {
    this.basketButton.textContent = text;
  }

  set buttonDisabled(value: boolean) {
    this.basketButton.disabled = value;
  }

  render(data: IPreviewCardView): HTMLElement {
    super.render(data);
    return this.container;
  }
}
