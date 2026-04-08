import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands.service';
import { ProductsService } from '../../core/services/products.service';
import { Brand } from '../../core/models/brand.interface';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand-details',
  imports: [RouterLink],
  templateUrl: './brand-details.component.html',
  styleUrl: './brand-details.component.css',
})
export class BrandDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly brandsService = inject(BrandsService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  brandDetails = signal<Brand>({} as Brand);
  productList = signal<Product[]>([]);
  product = input.required<Product>();

  wishlist = signal<string[]>([]);

  ngOnInit(): void {
    this.loadWishlist();
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('ID:', id);

      if (id) {
        this.getBrand(id);
        this.getProductsByBrand(id);
      }
    });
  }

  loadWishlist(): void {
    this.productsService.getProductToWishList().subscribe({
      next: (res) => {
        this.wishlist.set(res.data);
        this.cartService.wishlistCount.set(res.data.length);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  getBrand(id: string): void {
    this.brandsService.getSpecificBrand(id).subscribe({
      next: (res) => {
        this.brandDetails.set(res.data);
      },
      error: (err) => {
        console.log('Error loading brand:', err);
      },
    });
  }

  getProductsByBrand(brandId: string): void {
    this.productsService.getProductsByBrand(brandId).subscribe({
      next: (res) => {
        console.log('Products:', res.data);
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log('Error loading products:', err);
      },
    });
  }

  addToWishList(productId: string): void {
    this.productsService.addProductToWishList(productId).subscribe({
      next: (res) => {
        console.log(res);

        this.wishlist.set(res.data);

        this.cartService.wishlistCount.set(res.data.length);

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
  calculateDiscountPercentage(): number {
    const price = this.product().price;
    const priceAfterDiscount = this.product().priceAfterDiscount;

    if (priceAfterDiscount && price && priceAfterDiscount < price) {
      const discount = ((price - priceAfterDiscount) / price) * 100;
      return Math.round(discount);
    }
    return 0;
  }

  getStars(rating: number) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return {
      full: Array(fullStars).fill(0),
      half: hasHalfStar,
      empty: Array(emptyStars).fill(0),
    };
  }
}
