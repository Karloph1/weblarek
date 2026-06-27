import { IContactsFormView } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { FormView } from "./FormView";

export class ContactsFormView extends FormView {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;
  private readonly submitButton: HTMLButtonElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      element,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      element,
    );
    this.submitButton = ensureElement<HTMLButtonElement>(".button", element);

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

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  set email(email: string) {
    this.emailInput.value = email;
  }

  set phone(phone: string) {
    this.phoneInput.value = phone;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  render(data: Partial<IContactsFormView>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
