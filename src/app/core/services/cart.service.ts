import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Cart,
  CashOrderPayload,
  CashOrderResponse,
  ShippingAddress,
} from '../../features/cart/models/cart.interface';
import { CART_API } from '../../features/cart/models/cart.api';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);

  cartDetails = signal<Cart>({} as Cart);

  cartCount = computed(() =>
    this.cartDetails().products ? this.cartDetails().products.length : 0,
  );

  wishlistCount = signal<number>(0);

  creatCashOrder(cartId: string, data: ShippingAddress) {
    const payload = this.transformCashOrderPayload(data);

    console.log('backend Value: ', payload);

    return this.httpClient.post<CashOrderResponse>(
      environment.baseUrl + CART_API.cashOrder(cartId),
      payload,
    );
  }

  transformCashOrderPayload(formValue: ShippingAddress): CashOrderPayload {
    return {
      shippingAddress: formValue,
    };
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
