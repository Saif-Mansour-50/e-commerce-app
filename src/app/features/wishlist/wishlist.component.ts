import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly toastrService = inject(ToastrService);
  protected readonly cartService = inject(CartService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  wishlistProducts = signal<Product[]>([]);
  wishlistcount = signal<number>(0);

  count = computed(() => this.cartService.cartCount());

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getWishListProducts();
    }
  }

  getWishListProducts(): void {
    this.productsService.getProductToWishList().subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistProducts.set(res.data);
        this.wishlistcount.set(res.count);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeFromWishList(productId: string): void {
    this.productsService.removeProductFromWishList(productId).subscribe({
      next: (res) => {
        this.wishlistProducts.update((list) => list.filter((p) => p._id !== productId));
        console.log(res);

        const newCount = res.data.length;
        this.wishlistcount.set(newCount);

        this.wishlistProducts.update((list) => list.filter((p) => p._id !== productId));

        if (isPlatformBrowser(this.pLATFORM_ID)) {
          this.toastrService.success('Product removed from wishlist', 'freshCart', {
            progressBar: true,
          });
        }
      },
      error: (err) => {
        console.log(err);
        if (isPlatformBrowser(this.pLATFORM_ID)) {
          this.toastrService.error('Failed to remove product', 'freshCart', { progressBar: true });
        }
      },
    });
  }

  addToCard(id: string): void {
    if (isPlatformBrowser(this.pLATFORM_ID) && localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          console.log(res);

          this.cartService.cartDetails.set(res.data);

          if (isPlatformBrowser(this.pLATFORM_ID)) {
            this.toastrService.success(res.message, 'freshCart', { progressBar: true });
          }
        },
        error: (err) => {
          console.log(err);
          if (isPlatformBrowser(this.pLATFORM_ID)) {
            this.toastrService.error('Failed to add product', 'freshCart', { progressBar: true });
          }
        },
      });
    } else if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.toastrService.warning('Login First', 'freshCart', { progressBar: true });
    }
  }
}
