import { ICatalogCardView, TCategory } from "../../../types/index.ts";
import { categoryMap, CDN_URL } from "../../../utils/constants.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events";
import { CardView } from "./CardView.ts";

export class CatalogCardView extends CardView {
  private readonly imageElement: HTMLImageElement;
  private readonly categoryElement: HTMLElement;
  private readonly previewButton: HTMLElement;
  private _id: string = "";

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      element,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      element,
    );
    this.previewButton = ensureElement<HTMLElement>(element);

    this.addEventListeners();
  }

  private addEventListeners() {
    this.previewButton.addEventListener("click", () => {
      this.events.emit("preview:select", {
        id: this._id,
      });
    });
  }

  set id(id: string) {
    this._id = id;
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

  render(data: ICatalogCardView): HTMLElement {
    super.render(data);
    return this.container;
  }
}
