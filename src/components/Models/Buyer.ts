import { TPayment } from "../../types/index";

export class Buyer {
  private payment?: TPayment;
  private email?: string;
  private phone?: string;
  private address?: string;

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

  getBuyer(): Buyer {
    return this;
  }

  deleteBuyer(): void {
    this.payment = undefined;
    this.email = undefined;
    this.phone = undefined;
    this.address = undefined;
  }

  validateBuyer(): { field: string; message: string }[] {
    const errors: {
      field: string;
      message: string;
    }[] = [];

    if (this.payment === undefined) {
      errors.push({
        field: "payment",
        message: "Не выбран вид оплаты",
      });
    }

    if (this.email === undefined) {
      errors.push({
        field: "email",
        message: "Укажите электронную почту",
      });
    }

    if (this.phone === undefined) {
      errors.push({
        field: "phone",
        message: "Укажите телефон",
      });
    }

    if (this.address === undefined) {
      errors.push({
        field: "address",
        message: "Укажите адрес",
      });
    }

    return errors;
  }
}
