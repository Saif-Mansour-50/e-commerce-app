import { Component, inject, signal } from '@angular/core';
import { Catigory } from '../../core/models/catigory.interface';
import { CategoriesService } from '../../core/services/categories.service';

@Component({
  selector: 'app-all-categories',
  imports: [],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css',
})
export class AllCategoriesComponent {
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
