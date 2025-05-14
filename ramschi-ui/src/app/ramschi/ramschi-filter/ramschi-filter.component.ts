import { Component } from '@angular/core';
import { ICategory } from '../domain';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../category.service';
import { AssigneeService } from '../assignee.service';
import { CredentialService, RoleAware } from '../../login/credential.service';
import { MatIconModule } from '@angular/material/icon';
import { ItemListService } from '../item-list.service';

@Component({
  selector: 'app-ramschi-filter',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './ramschi-filter.component.html',
  styleUrl: './ramschi-filter.component.css'
})
export class RamschiFilterComponent extends RoleAware {

  get filterName(): string {
    return this.itemList.getFilterName();
  }

  set filterName(value: string) {
    this.itemList.setFilterName(value);
  }

  get filterCategory(): string | null {
    return this.itemList.getFilterCategory();
  }
  set filterCategory(value: string | null) {
    this.itemList.setFilterCategory(value);
  }

  get filterAssignee(): string | null {
    return this.itemList.getFilterAssignee();
  }
  set filterAssignee(value: string | null) {
    this.itemList.setFilterAssignee(value);
  }

  get latestFirst(): boolean {
    return this.itemList.getLatestFirst();
  }
  set latestFirst(value: boolean) {
    this.itemList.setLatestFirst(value);
  }
    
  get filterSummary(): string {
    const filters: string[] = [];
    if (this.filterName) {
      filters.push('"' + this.filterName + '"');
    }
    if (this.filterCategory) {
      filters.push(this.categoryService.getById(this.filterCategory)?.name);
    }
    if (this.filterAssignee) {
      filters.push(this.filterAssignee);
    }
    if (this.latestFirst) {
      filters.push('neustes zuerst');
    }
    return filters.join(', ');
  }

  get otherAssignees(): string[] {
    return this.assigneeService.getAll()
    .filter(assignee => assignee !== this.assignee);
  }

  get categories(): ICategory[] {
    return this.categoryService.getAll();
  }

  constructor(
    private readonly categoryService: CategoryService,
    private readonly assigneeService: AssigneeService,
    private readonly itemList: ItemListService,
    credential: CredentialService,
  ) {
    super(credential);
  }

  clearFilter(event: Event): void {
    this.itemList.clearFilter();
    event.stopPropagation();
  }

}