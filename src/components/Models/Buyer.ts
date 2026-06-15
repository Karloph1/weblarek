import { IBuyer, TPayment, TValidateArray } from "../../types/index";

export class Buyer {
  private payment: TPayment = "";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  setBuyerPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setBuyerEmail(email: string): void {
    this.email = email;
  }

  setBuyerPhone(phone: string): void {
    this.phone = phone;
  }

  setBuyerAddress(address: string): void {
    this.address = address;
  }

  getBuyer(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clearBuyer(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
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
      errors.address = "Укажите адресс";
    }

    return errors;
  }
}
