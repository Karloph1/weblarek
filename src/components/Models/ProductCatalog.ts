import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  private products: IProduct[];
  private currentProduct: IProduct | null;
  protected readonly events: IEvents;

  constructor(events: IEvents) {
    this.products = [];
    this.currentProduct = null;
    this.events = events;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;

    this.events.emit("catalog:changed");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    const product: IProduct | undefined = this.products.find(
      (x) => x.id === id,
    );

    return product;
  }

  setCurrentProduct(product: IProduct): void {
    this.currentProduct = product;

    this.events.emit("preview:changed");
  }

  getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}
