import { Injectable } from '@angular/core';
import { ICategory} from './domain';
import { RamschiService } from './ramschi.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: ICategory[] = [];

  private categoryMap: Record<string, ICategory> = {};

  constructor(private readonly service: RamschiService) {
    service.getCategories().subscribe(categories => {
      this.categories = categories;
      categories.forEach(c => this.categoryMap[c.id] = c);
    });
  }

  getAll(): ICategory[] {
    return this.categories;
  }

  getById(id: string): ICategory {
    return this.categoryMap[id];
  }

}
