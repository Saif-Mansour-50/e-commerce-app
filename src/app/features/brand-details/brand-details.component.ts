import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands.service';
import { ProductsService } from '../../core/services/products.service';
import { Brand } from '../../core/models/brand.interface';
import { Product } from '../../core/models/product.interface';

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

  brandDetails = signal<Brand>({} as Brand);
  productList = signal<Product[]>([]);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log('ID:', id);

      if (id) {
        this.getBrand(id);
        this.getProductsByBrand(id);
      }
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

  // ✅ عدل اسم الدالة واستخدم getProductsByBrand
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
}
