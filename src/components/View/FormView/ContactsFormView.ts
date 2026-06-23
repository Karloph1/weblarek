import { IContactsFormView } from "../../../types";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export class ContactsFormView extends Component<IContactsFormView> {
  private readonly events: IEvents;
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    const container = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    super(container);

    this.events = events;
    this.emailInput = container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;
    this.phoneInput = container.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.emailInput.addEventListener("input", () => {
      this.events.emit("order.email:change", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("order.phone:change", {
        phone: this.phoneInput.value,
      });
    });
  }

  set email(email: string) {
    this.emailInput.value = email;
  }

  set phone(phone: string) {
    this.phoneInput.value = phone;
  }

  render(data: Partial<IContactsFormView>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
