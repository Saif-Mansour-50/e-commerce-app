import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Cart } from './models/cart.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);

  cartDetails = signal<Cart>({} as Cart);

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.cartService.getCartData().subscribe({
      next: (res) => {
        console.log(res.data);

        this.cartDetails.set(res.data);
      },
    });
  }

  removeItem(id: string): void {
    this.cartService.removeProductItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res.data);
      },
    });
  }

  update(id: string, count: number): void {
    this.cartService.updateProductItem(id, count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res.data);
      },
    });
  }

  clearAll(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails.set(res.data);
      },
    });
  }
}
