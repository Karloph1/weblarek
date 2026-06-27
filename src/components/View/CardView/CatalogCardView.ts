import { ICatalogCardView, TCategory } from "../../../types/index.ts";
import { categoryMap, CDN_URL } from "../../../utils/constants.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { CardView } from "./CardView.ts";

export class CatalogCardView extends CardView {
  private readonly imageElement: HTMLImageElement;
  private readonly categoryElement: HTMLElement;
  private readonly previewButton: HTMLElement;

  constructor(element: HTMLElement, onClick: () => void) {
    super(element);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      element,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      element,
    );
    this.previewButton = ensureElement<HTMLElement>(element);
    this.previewButton.addEventListener("click", onClick);
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
