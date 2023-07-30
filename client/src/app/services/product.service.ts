import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductModelServer, ServerResponse } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  SERVER_URL = 'http://localhost:8001/api';

  constructor(private http: HttpClient) {}

  // fetch all products from backend
  getAllProducts(limitOfResults: number = 10): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: limitOfResults.toString(),
      },
    });
  }

  //Get single product from server //
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(
      this.SERVER_URL + '/products' + id
    );
  }

  // GET products from one category //
  getProductsFromCategory(catName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(
      this.SERVER_URL + '/products/category/' + catName
    );
  }
}
