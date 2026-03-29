import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  protected readonly cartService = inject(CartService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getCartData();
    }
  }

  getCartData(): void {
    this.cartService.getCartData().subscribe({
      next: (res) => {
        this.cartService.cartDetails.set(res.data);
      },
    });
  }

  removeItem(id: string): void {
    this.cartService.removeProductItem(id).subscribe({
      next: (res) => {
        this.cartService.cartDetails.set(res.data);
      },
    });
  }

  update(id: string, count: number): void {
    this.cartService.updateProductItem(id, count).subscribe({
      next: (res) => {
        this.cartService.cartDetails.set(res.data);
      },
    });
  }

  clearAll(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        this.cartService.cartDetails.set(res.data);
      },
    });
  }
}
