import { Component, inject, input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);

  product = input.required<Product>();

  addProduct(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          console.log(res);
          (this.cartService.cartCount.set(res.numOfCartItems),
            (this.toastrService.success(res.message, 'FreshCart'),
            { progressBar: true, closeButton: true }));
        },
      });
    } else {
      (this.toastrService.warning('Login First', 'FreshCart'),
        { progressBar: true, closeButton: true });
    }
  }
}
