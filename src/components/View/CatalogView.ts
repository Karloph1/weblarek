import { IItemView } from "../../types";
import { Component } from "../base/Component";

export class CatalogView extends Component<IItemView> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}