import { IProduct } from "../../types/index";

export class Basket {
  private products: IProduct[];

  constructor() {
    this.products = [];
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
  }

  deleteProduct(product: IProduct): void {
    const indexProduct = this.products.indexOf(product);

    if (indexProduct !== -1) {
      this.products.splice(indexProduct, 1);
    }
  }

  clearBasket(): void {
    this.products = [];
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
