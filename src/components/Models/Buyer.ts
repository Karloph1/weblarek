import { IBuyer, TPayment, TValidateArray } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment = "";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor(private events: IEvents) {}

  setBuyerPayment(payment: TPayment): void {
    this.payment = payment;

    this.events.emit("buyer:change");
  }

  setBuyerEmail(email: string): void {
    this.email = email;

    this.events.emit("buyer:change");
  }

  setBuyerPhone(phone: string): void {
    this.phone = phone;

    this.events.emit("buyer:change");
  }

  setBuyerAddress(address: string): void {
    this.address = address;

    this.events.emit("buyer:change");
  }

  getBuyer(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearBuyer(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";

    this.events.emit("buyer:change");
  }

  validateBuyer(): TValidateArray {
    const errors: TValidateArray = {};

    if (this.payment === "") {
      errors.payment = "Не выбран вид оплаты";
    }

    if (this.email === "") {
      errors.email = "Укажите электронную почту";
    }

    if (this.phone === "") {
      errors.phone = "Укажите номер телефона";
    }

    if (this.address === "") {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
