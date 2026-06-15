import { IApi, IProductListResponse, IOrderRequest, IOrderResult } from '../types/index.ts';

export class CommunicationLayer {
    constructor(private api: IApi) {}

    async fetchProducts(): Promise<IProductListResponse> {
        return this.api.get<IProductListResponse>('/product/');
    }

    async submitOrder(orderData: IOrderRequest): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', orderData);
    }
}