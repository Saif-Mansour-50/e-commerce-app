import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartCount = signal<number>(0);

  private readonly httpClient = inject(HttpClient);

  creatCashOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/${cartId}`, data);
  }

  creatVisaOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `/api/v1/orders/checkout-session/${cartId}?url=${environment.url}`,
      data,
    );
  }

  addProductToCart(productId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v2/cart`, {
      productId: productId,
    });
  }

  getCartData(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v2/cart`);
  }

  removeProductItem(productId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart/${productId}`);
  }

  updateProductItem(productId: string, count: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/api/v2/cart/${productId}`, {
      count: count,
    });
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart`);
  }
}
