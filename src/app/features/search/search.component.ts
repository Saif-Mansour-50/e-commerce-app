import {
  Component,
  inject,
  OnInit,
  signal,
  effect,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { BrandsService } from '../../core/services/brands.service';
import { Product } from '../../core/models/product.interface';
import { CardComponent } from '../../shared/ui/card/card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-search',
  imports: [CardComponent, NgxPaginationModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit, AfterViewInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private brandsService = inject(BrandsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  allProducts = signal<Product[]>([]);
  productList = signal<Product[]>([]);
  itemsPerPage = signal<number>(15);
  currentPage = signal<number>(1);
  totalItems = signal<number>(0);

  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);

  searchKeyword = signal<string>('');
  selectedCategories = signal<string[]>([]);
  selectedBrand = signal<string>('');
  priceMin = signal<number | null>(null);
  priceMax = signal<number | null>(null);

  private searchSubject = new Subject<string>();

  constructor() {
    effect(() => {
      this.updateUrlFilters();
    });
  }

  ngOnInit(): void {
    this.loadCategoriesAndBrands();

    this.loadAllProducts();

    this.route.queryParams.subscribe((params) => {
      const keyword = params['keyword'] || '';
      const categories = params['categoryIn'] ? params['categoryIn'].split(',') : [];
      const brand = params['brand'] || '';
      const priceGte = params['priceGte'] ? Number(params['priceGte']) : null;
      const priceLte = params['priceLte'] ? Number(params['priceLte']) : null;
      const page = params['page'] ? Number(params['page']) : 1;

      this.searchKeyword.set(keyword);
      this.selectedCategories.set(categories);
      this.selectedBrand.set(brand);
      this.priceMin.set(priceGte);
      this.priceMax.set(priceLte);
      this.currentPage.set(page);

      if (this.searchInputRef) {
        this.searchInputRef.nativeElement.value = keyword;
      }

      this.searchSubject.next(keyword);

      this.applyFilters();
    });

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((keyword) => {
      this.searchKeyword.set(keyword);
      this.currentPage.set(1);

      this.updateUrlFilters();
    });
  }

  ngAfterViewInit() {
    if (this.searchKeyword() && this.searchInputRef) {
      this.searchInputRef.nativeElement.value = this.searchKeyword();
    }
  }

  loadCategoriesAndBrands() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res: any) => this.categories.set(res.data || []),
      error: (err) => console.error('Error loading categories', err),
    });
    this.brandsService.getBrand().subscribe({
      next: (res: any) => this.brands.set(res.data || []),
      error: (err) => console.error('Error loading brands', err),
    });
  }

  loadAllProducts() {
    this.productsService.getAllProducts(1, 1000, '').subscribe({
      next: (res) => {
        this.allProducts.set(res.data || []);
        this.applyFilters();
      },
      error: (err) => console.error('Error loading products', err),
    });
  }

  applyFilters() {
    let filtered = this.allProducts();
    const keyword = this.searchKeyword().toLowerCase().trim();
    const categories = this.selectedCategories();
    const brand = this.selectedBrand();
    const min = this.priceMin();
    const max = this.priceMax();

    if (keyword) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(keyword) ||
          product.brand?.name?.toLowerCase().includes(keyword) ||
          product.category?.name?.toLowerCase().includes(keyword),
      );
    }

    if (categories.length) {
      filtered = filtered.filter((product) => categories.includes(product.category._id));
    }

    if (brand) {
      filtered = filtered.filter((product) => product.brand._id === brand);
    }

    if (min !== null) {
      filtered = filtered.filter((product) => product.price >= min);
    }
    if (max !== null) {
      filtered = filtered.filter((product) => product.price <= max);
    }

    this.totalItems.set(filtered.length);

    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    this.productList.set(filtered.slice(start, end));
  }

  private updateUrlFilters() {
    const queryParams: any = {
      keyword: this.searchKeyword() || null,
      brand: this.selectedBrand() || null,
      page: this.currentPage() !== 1 ? this.currentPage() : null,
    };

    if (this.selectedCategories().length) {
      queryParams.categoryIn = this.selectedCategories().join(',');
    } else {
      queryParams.categoryIn = null;
    }

    if (this.priceMin() !== null) {
      queryParams.priceGte = this.priceMin();
    } else {
      queryParams.priceGte = null;
    }

    if (this.priceMax() !== null) {
      queryParams.priceLte = this.priceMax();
    } else {
      queryParams.priceLte = null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  searchByKeyWord(event: any) {
    this.searchSubject.next(event.target.value);
  }

  clearSearch(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.searchSubject.next('');
  }

  onCategoryChange(categoryId: string, event: any) {
    const isChecked = event.target.checked;
    const current = this.selectedCategories();
    if (isChecked) {
      this.selectedCategories.set([...current, categoryId]);
    } else {
      this.selectedCategories.set(current.filter((id) => id !== categoryId));
    }
    this.currentPage.set(1);
  }

  onBrandChange(brandId: string) {
    this.selectedBrand.set(brandId);
    this.currentPage.set(1);
  }

  onPriceMinChange(value: string) {
    const num = value ? Number(value) : null;
    this.priceMin.set(num);
    this.currentPage.set(1);
  }

  onPriceMaxChange(value: string) {
    const num = value ? Number(value) : null;
    this.priceMax.set(num);
    this.currentPage.set(1);
  }

  setPriceRange(min: number, max: number) {
    this.priceMin.set(min);
    this.priceMax.set(max);
    this.currentPage.set(1);
  }

  clearBrand() {
    this.selectedBrand.set('');
    this.currentPage.set(1);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
