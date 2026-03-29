import { Component, inject, input, signal } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  private readonly toastrService = inject(ToastrService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  count = this.cartService.cartCount();

  product = input.required<Product>();

  wishlist = signal<string[]>([]);

  addProduct(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          console.log(res);

          (this.toastrService.success(res.message, 'FreshCart'),
            { progressBar: true, closeButton: true });
        },
      });
    } else {
      (this.toastrService.warning('Login First', 'FreshCart'),
        { progressBar: true, closeButton: true });
    }
  }

  addToWishList(productId: string): void {
    this.productsService.addProductToWishList(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.wishlist.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
