import { IProduct } from "../../types/index";

export class ProductCatalog {
  private products: IProduct[];
  private currentProduct: IProduct | null;

  constructor() {
    this.products = [];
    this.currentProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
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
  }

  getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}
