import { IFormView } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export abstract class FormView extends Component<IFormView> {
  protected readonly events: IEvents;
  private readonly errorElement: HTMLElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element);
    this.events = events;
    this.errorElement = ensureElement<HTMLElement>(".form__errors", element);
  }

  set error(value: string) {
    this.errorElement.textContent = value;
  }

  render(data: Partial<IFormView>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
