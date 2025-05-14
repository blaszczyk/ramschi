import { Injectable } from '@angular/core';
import { IItem } from './domain';
import { RamschiService } from './ramschi.service';
import { ScrollService } from '../scroll.service';
import { SpinnerService } from '../spinner.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemListService {

  private items: IItem[] = [];

  private filteredItems: IItem[] = [];

  private filterName = '';

  private filterCategory: string | null = null;

  private filterAssignee: string | null = null;

  private latestFirst = false;


  constructor(private readonly service: RamschiService,
    private readonly scroll: ScrollService,
    private readonly spinner: SpinnerService,
  ) {
    this.filterName = localStorage.getItem(KEY_FILTER_NAME) || '';
    this.filterCategory = localStorage.getItem(KEY_FILTER_CATEGORY);
    this.filterAssignee = localStorage.getItem(KEY_FILTER_ASSIGNEE);
    this.latestFirst = !!localStorage.getItem(KEY_LATEST_FIRST);

    this.spinner.show();
    this.requestItems()
      .subscribe(() => {
        this.spinner.hide();
        this.setFilter();
      });
  }

  getFilterName(): string {
    return this.filterName;
  }

  getFilterCategory(): string | null {
    return this.filterCategory;
  } 

  getFilterAssignee(): string | null {
    return this.filterAssignee;
  }

  getLatestFirst(): boolean {
    return this.latestFirst;
  }
  
  setFilterName(filterName: string): void {
    this.filterName = filterName;
    this.setFilter();
  }

  setFilterCategory(filterCategory: string | null): void {
    this.filterCategory = filterCategory;
    this.setFilter();
  }

  setFilterAssignee(filterAssignee: string | null): void {
    this.filterAssignee = filterAssignee;
    this.setFilter();
  }

  setLatestFirst(latestFirst: boolean): void {
    this.latestFirst = latestFirst;
    this.setFilter();
  }

  clearFilter(): void {
    this.filterName = '';
    this.filterCategory = null;
    this.filterAssignee = null;
    this.latestFirst = false;
    this.setFilter();
  }

  getItems(): IItem[] {
    return this.filteredItems;
  }
  
  refresh() {
    this.requestItems().subscribe();
  }

  private setFilter(): void {
    updateLocalStorage(KEY_FILTER_NAME, this.filterName);
    updateLocalStorage(KEY_FILTER_CATEGORY, this.filterCategory);
    updateLocalStorage(KEY_FILTER_ASSIGNEE, this.filterAssignee);
    updateLocalStorage(
      KEY_LATEST_FIRST,
      this.latestFirst ? 'yes please' : null,
    );
    this.filteredItems = this.items.filter(item =>
      (item.name.toLowerCase().includes(this.filterName.toLowerCase()))
      && (!this.filterCategory || item.category === this.filterCategory)
      && (!this.filterAssignee || item.assignees.includes(this.filterAssignee))
    );
    if (this.latestFirst) {
      this.filteredItems.sort((i1, i2) => i2.lastedit - i1.lastedit);
    }
    this.scroll.forgetPosition();
    this.scroll.restorePosition();
  }

  private requestItems(): Observable<IItem[]> {
    return this.service
      .getItems().pipe(tap(items => {
        this.items = items;
      }));
  }
}

const KEY_FILTER_NAME = 'filter-name';
const KEY_FILTER_CATEGORY = 'filter-category';
const KEY_FILTER_ASSIGNEE = 'filter-assignee';
const KEY_LATEST_FIRST = 'latest-first';

function updateLocalStorage(key: string, value: string | null) {
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}
