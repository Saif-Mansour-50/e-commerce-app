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
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res.data);

        this.cartDetails.set(res.data);
      },
    });
  }
}
