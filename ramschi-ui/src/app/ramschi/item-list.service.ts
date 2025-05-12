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

  private filterName = '';

  private filterCategory: string | undefined = undefined;

  private filterAssignee: string | undefined = undefined;

  private latestFirst = false;


  constructor(private readonly service: RamschiService,
    private readonly scroll: ScrollService,
    private readonly spinner: SpinnerService,
  ) {
    const storedFilterName = localStorage.getItem(KEY_FILTER_NAME);
    if (storedFilterName) {
      this.filterName = storedFilterName;
    }

    const storedFilterCategory = localStorage.getItem(KEY_FILTER_CATEGORY);
    if (storedFilterCategory) {
      this.filterCategory = storedFilterCategory;
    }

    const storedFilterAssignee = localStorage.getItem(KEY_FILTER_ASSIGNEE);
    if (storedFilterAssignee) {
      this.filterAssignee = storedFilterAssignee;
    }

    const storedLatestFirst = localStorage.getItem(KEY_LATEST_FIRST);
    if (storedLatestFirst) {
      this.latestFirst = !!storedLatestFirst;
    }

    this.setFilter();
  }

  getFilterName(): string {
    return this.filterName;
  }

  getFilterCategory(): string | undefined {
    return this.filterCategory;
  } 

  getFilterAssignee(): string | undefined {
    return this.filterAssignee;
  }

  getLatestFirst(): boolean {
    return this.latestFirst;
  }
  
  setFilterName(filterName: string): void {
    this.filterName = filterName;
    this.setFilter();
  }

  setFilterCategory(filterCategory: string | undefined): void {
    this.filterCategory = filterCategory;
    this.setFilter();
  }

  setFilterAssignee(filterAssignee: string | undefined): void {
    this.filterAssignee = filterAssignee;
    this.setFilter();
  }

  setLatestFirst(latestFirst: boolean): void {
    this.latestFirst = latestFirst;
    this.setFilter();
  }

  clearFilter(): void {
    this.filterName = '';
    this.filterCategory = undefined;
    this.filterAssignee = undefined;
    this.latestFirst = false;
    this.setFilter();
  }

  getItems(): IItem[] {
    return this.items;
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
      this.latestFirst ? 'yes please' : undefined,
    );
    this.spinner.show();
    this.requestItems()
      .subscribe(() => {
        this.scroll.forgetPosition();
        this.spinner.hide();
      });
  }

  private requestItems(): Observable<IItem[]> {
    return this.service
      .getItems(
        this.filterName,
        this.filterCategory,
        this.filterAssignee,
        this.latestFirst,
      ).pipe(tap(items => {
        this.items = items;
      }));
  }
}

const KEY_FILTER_NAME = 'filter-name';
const KEY_FILTER_CATEGORY = 'filter-category';
const KEY_FILTER_ASSIGNEE = 'filter-assignee';
const KEY_LATEST_FIRST = 'latest-first';

function updateLocalStorage(key: string, value: string | undefined) {
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}
