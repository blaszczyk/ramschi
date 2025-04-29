import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { Category, categoryDisplayName, IItem } from '../domain';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule} from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ramschi-list',
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatGridListModule, MatExpansionModule, FormsModule],
  templateUrl: './ramschi-list.component.html',
  styleUrl: './ramschi-list.component.css'
})
export class RamschiListComponent implements OnInit {

  items: IItem[] = [];

  filterName: string = '';

  filterCategory: Category | undefined = undefined;

  get filterSummary(): string {
    const filters: string[] = [];
    if (this.filterName) {
      filters.push('"' + this.filterName + '"');
    }
    if (this.filterCategory) {
      filters.push(categoryDisplayName(this.filterCategory));
    }
    return filters.join(', ');
  }
  
  categories: { id:Category, displayName: string }[] = Object.values(Category)
    .map(id => ({id, displayName: categoryDisplayName(id)}));

  constructor(private readonly service: RamschiService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    console.log(this, this.filterName, this.filterCategory);
    this.service.getItems(this.filterName, this.filterCategory).subscribe(items => this.items = items);
  }

  navigateTo(item: IItem): void {
    this.router.navigateByUrl('/ramsch/' + item.id);
  }

}
