import { Injectable } from '@angular/core';
import { IItem } from './domain';
import { RamschiService } from './ramschi.service';
import { ScrollService } from '../scroll.service';
import { SpinnerService } from '../spinner.service';

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

    this.requestItems();
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
  
  setFilterName(value: string): void {
    this.filterName = value;
    this.requestItems();
  }

  setFilterCategory(value: string | undefined): void {
    this.filterCategory = value;
    this.requestItems();
  }

  setFilterAssignee(value: string | undefined): void {
    this.filterAssignee = value;
    this.requestItems();
  }

  setLatestFirst(value: boolean): void {
    this.latestFirst = value;
    this.requestItems();
  }

  clearFilter(): void {
    this.filterName = '';
    this.filterCategory = undefined;
    this.filterAssignee = undefined;
    this.latestFirst = false;
    this.requestItems();
  }

  getItems(): IItem[] {
    return this.items;
  }


  private requestItems(): void {
    updateLocalStorage(KEY_FILTER_NAME, this.filterName);
    updateLocalStorage(KEY_FILTER_CATEGORY, this.filterCategory);
    updateLocalStorage(KEY_FILTER_ASSIGNEE, this.filterAssignee);
    updateLocalStorage(
      KEY_LATEST_FIRST,
      this.latestFirst ? 'yes please' : undefined,
    );
    this.spinner.show();
    this.service
      .getItems(
        this.filterName,
        this.filterCategory,
        this.filterAssignee,
        this.latestFirst,
      )
      .subscribe((items) => {
        this.scroll.forgetPosition();
        this.spinner.hide();
        this.items = items;
      });
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
