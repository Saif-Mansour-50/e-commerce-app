import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from '../../shared/ui/card/card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [CardComponent, NgxPaginationModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // سيغنالات العرض
  productList = signal<Product[]>([]);
  allProducts = signal<Product[]>([]);
  itemsPerPage = signal<number>(12);
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);
  searchKeyword = signal<string>('');

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const keyword = params['keyword'] || '';
      this.searchKeyword.set(keyword);
      this.applyFilter();
    });

    this.loadAllProducts();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((keyword) => {
      this.updateUrlKeyword(keyword);
      this.searchKeyword.set(keyword);
      this.currentPage.set(1);
      this.applyFilter();
    });
  }

  loadAllProducts() {
    this.productsService.getAllProducts(1, 1000, '').subscribe({
      next: (res) => {
        this.allProducts.set(res.data || []);
        this.applyFilter();
      },
      error: (err) => console.error(err),
    });
  }

  applyFilter() {
    const keyword = this.searchKeyword().toLowerCase().trim();
    let filtered = this.allProducts();

    if (keyword) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(keyword) ||
          product.brand?.name?.toLowerCase().includes(keyword) ||
          product.category?.name?.toLowerCase().includes(keyword),
      );
    }

    this.totalItems.set(filtered.length);

    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    this.productList.set(filtered.slice(start, end));
  }

  private updateUrlKeyword(keyword: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { keyword: keyword || null },
      queryParamsHandling: 'merge',
    });
  }

  searchByKeyWord(event: any) {
    const keyword = event.target.value;
    this.searchSubject.next(keyword);
  }

  clearSearch(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.searchSubject.next('');
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.applyFilter();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
