import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface ProductsResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private products: ProductsResponseModel[] = [];
  private SERVER_URL = 'http://localhost:8001/api';

  constructor(private http: HttpClient) {}

  getSingleOrder(orderId: number) {
    return this.http
      .get<ProductsResponseModel[]>(this.SERVER_URL + '/orders' + orderId)
      .toPromise();
  }
}
