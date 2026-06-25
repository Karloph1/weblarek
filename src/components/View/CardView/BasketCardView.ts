import { IBasketCardView } from "../../../types/index.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import { CardView } from "./CardView.ts";

export class BasketCardView extends CardView {
  private readonly idElement: HTMLElement;
  private readonly buttonElement: HTMLButtonElement;
  private _id: string = '';
  
  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    this.idElement = ensureElement<HTMLButtonElement>(".basket__item-index", element);
    this.buttonElement = ensureElement<HTMLButtonElement>(".card__button", element);
  
    this.addEventListeners();
  }
  
  addEventListeners() {
    this.buttonElement.addEventListener("click", () => {
      this.events.emit("basketElement:delete", {
        id: this._id
      });
    })
  }
  
  set id(id: string) {
    this._id = id;
  }
  
  set number(id: string) {
    this.idElement.textContent = id;
  }

  render(data: IBasketCardView): HTMLElement {
    super.render(data);
    return this.container;
  }
}
