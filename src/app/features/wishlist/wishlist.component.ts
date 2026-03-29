import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  imports: [],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);

  wishlistProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.getWishListProducts();
  }

  getWishListProducts(): void {
    this.productsService.getProductToWishList().subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistProducts.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeFromWishList(productId: string): void {
    this.productsService.removeProductFromWishList(productId).subscribe({
      next: () => {
        this.wishlistProducts.update((list) => list.filter((p) => p._id !== productId));
      },
      error: (err) => console.log(err),
    });
  }

  addToCard(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          console.log(res);

          this.toastrService.success(res.message, 'freshCart', { progressBar: true });
        },
      });
    } else {
      this.toastrService.warning('Login First', 'freshCart', { progressBar: true });
    }
  }
}
