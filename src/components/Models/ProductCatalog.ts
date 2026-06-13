import { IProduct } from "../../types/index";

export class ProductCatalog {
  private products: IProduct[];
  private currentProduct?: IProduct;

  constructor() {
    this.products = [];
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

  getCurrentProduct(): IProduct | undefined {
    return this.currentProduct;
  }
}
