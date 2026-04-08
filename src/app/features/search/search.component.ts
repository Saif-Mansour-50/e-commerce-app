import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from '../../shared/ui/card/card.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-search',
  imports: [CardComponent, NgxPaginationModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  productList = signal<Product[]>([]);
  itemsPerPage = signal<number>(12);
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);

  ngOnInit(): void {
    this.getProductData();
  }

  getProductData(page: number = 1): void {
    this.productsService.getAllProducts(page, this.itemsPerPage()).subscribe({
      next: (res) => {
        console.log('API Response search:', res);

        this.productList.set(res.data || []);

        if (res.metadata) {
          this.currentPage.set(res.metadata.currentPage);
          this.itemsPerPage.set(res.metadata.limit);
          this.totalItems.set(res.results);
        } else {
          console.warn('Metadata not found in response');
          this.totalItems.set(res.results || 0);
        }
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  onPageChange(page: number): void {
    this.getProductData(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
