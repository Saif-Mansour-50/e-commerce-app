import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../core/models/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-beauty-health',
  imports: [CardComponent],
  templateUrl: './beauty-health.component.html',
  styleUrl: './beauty-health.component.css',
})
export class BeautyHealthComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);

  productList = signal<Product[]>([]);
  categoryName = signal<string>("Women's Fashion");
  isLoading = signal<boolean>(false);

  private routeSubscription!: Subscription;

  ngOnInit(): void {
    this.loadWomenProducts();

    this.routeSubscription = this.route.params.subscribe((params) => {
      console.log('Params:', params);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadWomenProducts(): void {
    this.isLoading.set(true);
    // استخدام ID فئة Women's Fashion من الـ API
    const womenCategoryId = '6439d58a0049ad0b52b9003fz';

    this.productsService.getProducts(womenCategoryId).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.categoryName.set("Women's Fashion");
        this.isLoading.set(false);
        console.log('Women products:', res);
      },
      error: (err) => {
        console.log('Error fetching women products:', err);
        this.isLoading.set(false);
      },
    });
  }
}
