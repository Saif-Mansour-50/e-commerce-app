import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(pageNum: number = 1, limit: number = 40): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/api/v1/products?page=${pageNum}&limit=${limit}`,
    );
  }

  getProductsWithFilters(params: any): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/api/v1/products', { params });
  }

  getProducts(categoryId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products?category[in]=${categoryId}`);
  }

  getSpecificProduct(productId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products/${productId}`);
  }

  getProductsByBrand(brandId: string, pageNum: number = 1): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/api/v1/products?brand=${brandId}&page=${pageNum}`,
    );
  }

  addProductToWishList(productId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/wishlist`, { productId });
  }

  getProductToWishList(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/wishlist`);
  }

  removeProductFromWishList(id: String): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v1/wishlist/${id}`);
  }
}
