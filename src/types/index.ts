export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TValidateArray = Partial<Record<keyof IBuyer, string>>;

export type TPayment = "card" | "cash" | "";

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: IProduct["id"][];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface ICardView {
  title: string;
  price: number | null;
}

export interface ICatalogCardView extends ICardView {
  image: string;
  category: string;
}

export interface IPreviewCardView extends ICardView {
  image: string;
  description: string;
  category: string;
}

export interface IBasketCardView extends ICardView {
  id: string;
}

export interface IOrderFormView {
  payment: TPayment;
  address: string;
}

export interface IContactsFormView {
  email: string;
  phone: string;
}

export interface IModalView {
  content: HTMLElement;
}

export interface IItemView {
  items: HTMLElement[];
}

export interface IBasketView {
  items: HTMLElement[];
  total: number;
}
