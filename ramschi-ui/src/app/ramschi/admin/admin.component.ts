import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { FormsModule } from '@angular/forms';
import { ICategory } from '../domain';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  assignees: string[] = [];
  
  categories: ICategory[] = [];

  newAssignee: string | null = null;

  newCategoryId: string | null = null;

  newCategoryName: string | null = null;

  constructor (private readonly service: RamschiService) {}

  ngOnInit(): void {
    this.refresh();
  }

  createNewAssignee(): void {
    this.service.postAssignee(this.newAssignee!).subscribe(() => {
      this.newAssignee = null;
      this.refresh();
    });
  }

  deleteAssignee(name: string) {
    if (confirm(name + ' löschen?')) {
      this.service.deleteAssignee(name).subscribe(() => {
        this.refresh();
      });
    }
  }

  createNewCategory(): void {
    const category: ICategory = {
      id: this.newCategoryId!.toUpperCase(),
      name: this.newCategoryName!,
    }
    this.service.postCategory(category).subscribe(() => {
      this.newCategoryId = null;
      this.newCategoryName = null;
      this.refresh();
    });
  }

  updateCategory(category: ICategory): void {
    this.service.postCategory(category).subscribe(() => {
      this.refresh();
    });
  }

  private refresh() {
    this.service.getAssignees().subscribe(assignees => this.assignees = assignees);
    this.service.getCategories().subscribe(categories => this.categories = categories);
  }

}
