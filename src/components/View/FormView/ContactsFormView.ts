import { IBuyer, IContactsFormView } from "../../../types";
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

    this.submitButton.addEventListener("click", () => {
      this.events.emit("success:open");
    });
  }

  set email(email: string) {
    this.emailInput.value = email;
  }

  set phone(phone: string) {
    this.phoneInput.value = phone;
  }

  set valid(error: Partial<Record<keyof IBuyer, string>>) {
    const email = error.email;
    const phone = error.phone;

    const isAllowed: Boolean = email === undefined && phone === undefined;

    this.events.emit("submitButton:change", {
      isAllowed: isAllowed,
      htmlButton: this.submitButton,
    });
  }
  

  render(data: Partial<IContactsFormView>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
