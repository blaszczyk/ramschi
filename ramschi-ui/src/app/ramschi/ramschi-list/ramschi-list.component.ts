import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { ICategory, IItem } from '../domain';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerService } from '../../spinner.service';
import { ScrollService } from '../../scroll.service';
import { CategoryService } from '../category.service';
import { AssigneeService } from '../assignee.service';

@Component({
  selector: 'app-ramschi-list',
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatGridListModule, MatExpansionModule, MatCheckboxModule, FormsModule],
  templateUrl: './ramschi-list.component.html',
  styleUrl: './ramschi-list.component.css'
})
export class RamschiListComponent implements OnInit {

  items: IItem[] = [];

  filterName = '';

  filterCategory: string | undefined = undefined;

  filterAssignee: string | undefined = undefined;

  latestFirst = false;

  get filterSummary(): string {
    const filters: string[] = [];
    if (this.filterName) {
      filters.push('"' + this.filterName + '"');
    }
    if (this.filterCategory) {
      filters.push(this.catgoryService.getById(this.filterCategory)?.name);
    }
    if (this.filterAssignee) {
      filters.push(this.filterAssignee);
    }
    return filters.join(', ');
  }

  get assignees(): string[] {
    return this.assigneeService.getAll();
  };
  
  get categories(): ICategory[] {
    return this.catgoryService.getAll();
  };

  constructor(private readonly service: RamschiService,
    private readonly spinner: SpinnerService,
    private readonly scroll: ScrollService,
    private readonly catgoryService: CategoryService,
    private readonly assigneeService: AssigneeService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {

    const storedFilterName = localStorage.getItem(KEY_FILTER_NAME);
    if (storedFilterName ) {
      this.filterName = storedFilterName;
    }

    const storedFilterCategory = localStorage.getItem(KEY_FILTER_CATEGORY);
    if (storedFilterCategory ) {
      this.filterCategory = storedFilterCategory;
    }

    const storedFilterAssignee = localStorage.getItem(KEY_FILTER_ASSIGNEE);
    if (storedFilterAssignee ) {
      this.filterAssignee = storedFilterAssignee;
    }

    const storedLatestFirst = localStorage.getItem(KEY_LATEST_FIRST);
    if ( storedLatestFirst ) {
      this.latestFirst = !!storedLatestFirst;
    }

    this.getItems();
  }

  setFilter(): void {
    this.scroll.forgetPosition();
    this.getItems();
  }

  getSymbolAssignee(item: IItem): string {
    const nrAssignees = item.assignees.length;
    return nrAssignees === 0 ? '' : ( nrAssignees === 1 ? '☝️' : '✌️');
  }

  private getItems(): void {
    updateLocalStorage(KEY_FILTER_NAME, this.filterName);
    updateLocalStorage(KEY_FILTER_CATEGORY, this.filterCategory);
    updateLocalStorage(KEY_FILTER_ASSIGNEE, this.filterAssignee);
    updateLocalStorage(KEY_LATEST_FIRST, this.latestFirst ? 'yes please' : undefined);
    
    this.spinner.show();
    this.service.getItems(this.filterName, this.filterCategory, this.filterAssignee, this.latestFirst).subscribe(items => {
      this.items = items;
      this.spinner.hide();
      this.scroll.restorePosition();
    });
  }

  navigateTo(item: IItem): void {
    this.scroll.storePosition();
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
const KEY_LATEST_FIRST = 'latest-first';
