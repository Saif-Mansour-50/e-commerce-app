import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.interface';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-product-home',
  imports: [CardComponent],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.css',
})
export class ProductHomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  productList = signal<Product[]>([]);

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
