import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  productDetails = signal<Product>({} as Product);

  wishlist = signal<string[]>([]);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.getProductDetails(param.get('id')!);
    });
  }

  getProductDetails(id: string): void {
    this.productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        this.productDetails.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addProduct(id: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.addProductToCart(id).subscribe({
        next: (res) => {
          console.log(res);

          this.cartService.cartDetails.set(res.data);

          this.toastrService.success(res.message, 'FreshCart', {
            progressBar: true,
            closeButton: true,
          });
        },
      });
    } else {
      this.toastrService.warning('Login First', 'FreshCart', {
        progressBar: true,
        closeButton: true,
      });
    }
  }

  addToWishList(productId: string): void {
    this.productsService.addProductToWishList(productId).subscribe({
      next: (res) => {
        console.log(res);

        this.wishlist.set(res.data);

        this.toastrService.success('Added to wishlist', 'FreshCart', {
          progressBar: true,
          closeButton: true,
        });
      },
      error: (err) => {
        console.log(err);
        this.toastrService.error('Failed to add to wishlist', 'FreshCart', {
          progressBar: true,
          closeButton: true,
        });
      },
    });
  }
}
