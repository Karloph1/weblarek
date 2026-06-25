import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class Basket {
  private products: IProduct[];
  protected readonly events: IEvents;

  constructor(events: IEvents) {
    this.products = [];
    this.events = events;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);

    this.events.emit("basketSize:change");
  }

  deleteProduct(product: IProduct): void {
    const indexProduct = this.products.indexOf(product);

    if (indexProduct !== -1) {
      this.products.splice(indexProduct, 1);
    }

    this.events.emit("basketSize:change");
  }

  clearBasket(): void {
    this.products = [];

    this.events.emit("basketSize:change");
  }

  getGeneralPrice(): number {
    const sum: number = this.products.reduce((result, cur) => {
      if (cur.price !== null) {
        return (result += cur.price);
      }

      return result;
    }, 0);

    return sum;
  }

  getProductsAmount(): number {
    return this.products.length;
  }

  isProductInBasket(id: string): boolean {
    return this.products.some((x) => x.id === id);
  }
}
