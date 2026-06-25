import { IModalView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class ModalView extends Component<IModalView> {
  protected readonly closeButton: HTMLButtonElement;
  protected readonly contentContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );

    this.contentContainer = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );

    this.addEventListeners();
  }

  addEventListeners() {
    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", () => {
      this.close();
    });

    this.contentContainer.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  set content(content: HTMLElement) {
    this.contentContainer.replaceChildren(content);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentContainer.replaceChildren();
  }

  render(data: Partial<IModalView>): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
