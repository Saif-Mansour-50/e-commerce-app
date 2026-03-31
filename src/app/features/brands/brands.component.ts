import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandsService } from '../../core/services/brands.service';
import { Brand } from '../../core/models/brand.interface';

@Component({
  selector: 'app-brands',
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  brandList = signal<Brand[]>([]);

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.brandsService.getBrand().subscribe({
      next: (res) => {
        this.brandList.set(res.data);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
