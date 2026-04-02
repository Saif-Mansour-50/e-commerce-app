// electronics.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../core/models/product.interface';
import { ProductsService } from '../../core/services/products.service';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-electronics',
  imports: [CardComponent],
  templateUrl: './electronics.component.html',
  styleUrl: './electronics.component.css',
})
export class ElectronicsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  productList = signal<Product[]>([]);
  categoryName = signal<string>('Electronics');
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadElectronicsProducts();
  }

  loadElectronicsProducts(): void {
    this.isLoading.set(true);
    // استبدل هذا بالـ ID الصحيح لفئة Electronics
    const electronicsCategoryId = '6439d58a0049ad0b52b9003f'; // ضع الـ ID الحقيقي

    this.productsService.getProducts(electronicsCategoryId).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.isLoading.set(false);
        console.log('Electronics products:', res);
      },
      error: (err) => {
        console.log('Error fetching electronics products:', err);
        this.isLoading.set(false);
      },
    });
  }
}
