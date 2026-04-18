import { CategoriesService } from './../../../../core/services/categories.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Catigory } from '../../../../core/models/catigory.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-home',
  imports: [RouterLink],
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.css',
})
export class CategoryHomeComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  CategoriesList = signal<Catigory[]>([]);

  ngOnInit(): void {
    this.getCatigoriesData();
  }

  getCatigoriesData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.CategoriesList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
