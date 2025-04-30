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
import { SpinnerService } from '../../spinner.service';

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

  filterAssignee: string | undefined = undefined;

  assignees: string[] = [];

  get filterSummary(): string {
    const filters: string[] = [];
    if (this.filterName) {
      filters.push('"' + this.filterName + '"');
    }
    if (this.filterCategory) {
      filters.push(categoryDisplayName(this.filterCategory));
    }
    if (this.filterAssignee) {
      filters.push(this.filterAssignee);
    }
    return filters.join(', ');
  }
  
  categories: { id:Category, displayName: string }[] = Object.values(Category)
    .map(id => ({id, displayName: categoryDisplayName(id)}));

  constructor(private readonly service: RamschiService,
    private readonly spinner: SpinnerService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const storedFilterName = localStorage.getItem(KEY_FILTER_NAME);
    if (storedFilterName ) {
      this.filterName = storedFilterName;
    }
    const storedFilterCategory = localStorage.getItem(KEY_FILTER_CATEGORY);
    if (storedFilterCategory ) {
      this.filterCategory = storedFilterCategory as Category;
    }
    const storedFilterAssignee = localStorage.getItem(KEY_FILTER_ASSIGNEE);
    if (storedFilterAssignee ) {
      this.filterAssignee = storedFilterAssignee;
    }
    this.service.getAssignees().subscribe(assignees => this.assignees = assignees);
    this.getItems();
  }

  getItems(): void {
    updateLocalStorage(KEY_FILTER_NAME, this.filterName);
    updateLocalStorage(KEY_FILTER_CATEGORY, this.filterCategory);
    updateLocalStorage(KEY_FILTER_ASSIGNEE, this.filterAssignee);
    
    this.spinner.show();
    this.service.getItems(this.filterName, this.filterCategory, this.filterAssignee).subscribe(items => {
      this.items = items;
      this.spinner.hide();
    });
  }

  navigateTo(item: IItem): void {
    this.router.navigateByUrl('/ramsch/' + item.id);
  }

}

function updateLocalStorage(key: string, value: string | undefined) {
  if (value) {
    localStorage.setItem(key, value);
  }
  else {
    localStorage.removeItem(key);
  }

}

const KEY_FILTER_NAME = 'filter-name';
const KEY_FILTER_CATEGORY = 'filter-category';
const KEY_FILTER_ASSIGNEE = 'filter-assignee';
