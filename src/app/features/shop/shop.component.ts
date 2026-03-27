import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from '../../shared/ui/card/card.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-shop',
  imports: [CardComponent, NgxPaginationModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  productList = signal<Product[]>([]);
  pageSize = signal<number>(0);
  currentPage = signal<number>(0);
  total = signal<number>(0);

  ngOnInit(): void {
    this.getProductData();
  }

  getProductData(page: number = 1): void {
    this.productsService.getAllProducts(page).subscribe({
      next: (res) => {
        console.log('API Response:', res);

        this.productList.set(res.data || []);

        if (res.metadata) {
          this.pageSize.set(res.metadata.limit);
          this.currentPage.set(res.metadata.currentPage);
          this.total.set(res.results || res.metadata.total || 0);
        } else {
          console.warn('Metadata not found in response');
          this.total.set(res.results || 0);
        }
      },
    });
  }

  onPageChange(num: number): void {
    this.getProductData(num);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
