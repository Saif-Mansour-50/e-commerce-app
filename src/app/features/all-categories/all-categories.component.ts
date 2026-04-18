import { Component, inject, signal } from '@angular/core';
import { Catigory } from '../../core/models/catigory.interface';
import { CategoriesService } from '../../core/services/categories.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-categories',
  imports: [RouterLink],
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
