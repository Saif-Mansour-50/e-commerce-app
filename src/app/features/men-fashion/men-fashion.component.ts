// men-fashion.component.ts
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // فقط ActivatedRoute, ليس Router
import { Subscription } from 'rxjs';
import { Product } from '../../core/models/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-men-fashion',
  imports: [CardComponent, RouterLink],
  templateUrl: './men-fashion.component.html',
  styleUrl: './men-fashion.component.css',
})
export class MenFashionComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);

  productList = signal<Product[]>([]);
  categoryName = signal<string>("Men's Fashion");
  isLoading = signal<boolean>(false);

  private routeSubscription!: Subscription;

  ngOnInit(): void {
    // لأن المسار مباشر بدون parameters، نعرض منتجات الرجال مباشرة
    this.loadMenProducts();

    // إذا أردت الاستماع لأي parameters مستقبلية
    this.routeSubscription = this.route.params.subscribe((params) => {
      console.log('Params:', params);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadMenProducts(): void {
    this.isLoading.set(true);
    // استخدام ID فئة Men's Fashion من الـ API
    const menCategoryId = '6439d5b90049ad0b52b90048';

    this.productsService.getProducts(menCategoryId).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.categoryName.set("Men's Fashion");
        this.isLoading.set(false);
        console.log('Men products:', res);
      },
      error: (err) => {
        console.log('Error fetching men products:', err);
        this.isLoading.set(false);
      },
    });
  }
}
