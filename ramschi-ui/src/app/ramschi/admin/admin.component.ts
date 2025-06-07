import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { FormsModule } from '@angular/forms';
import { IAssignee, ICategory, IItem, Role } from '../domain';
import { CredentialService, RoleAware } from '../../login/credential.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent extends RoleAware implements OnInit {
  Role: typeof Role = Role;

  assignees: IAssignee[] = [];

  categories: ICategory[] = [];

  newAssignee: string | null = null;

  newCategoryId: string | null = null;

  newCategoryName: string | null = null;

  popupItems: IItem[] = [];

  constructor(
    private readonly service: RamschiService,
    credential: CredentialService,
  ) {
    super(credential);
  }

  ngOnInit(): void {
    this.refresh();
  }

  deleteAssignee(name: string) {
    if (confirm(name + ' löschen?')) {
      this.service.deleteAssignee(name).subscribe(this.alertSuccess);
    }
  }

  resetPassword(name: string) {
    if (confirm('Passwort von ' + name + ' zurücksetzen?')) {
      this.service.resetPassword(name).subscribe(this.alertSuccess);
    }
  }

  toggleRole(assignee: IAssignee) {
    if (
      confirm(
        assignee.name +
          ' ' +
          (assignee.role === Role.ASSIGNEE ? 'befördern' : 'herabstufen') +
          '?',
      )
    ) {
      const newRole =
        assignee.role === Role.ASSIGNEE ? Role.CONTRIBUTOR : Role.ASSIGNEE;
      this.service
        .putAssigneeRole(assignee.name, newRole)
        .subscribe(this.alertSuccess);
    }
  }

  showItems(assignee: IAssignee) {
    this.service
      .getItemsForAssignee(assignee.name)
      .subscribe((items) => (this.popupItems = items));
  }

  createNewCategory(): void {
    const category: ICategory = {
      id: this.newCategoryId!.toUpperCase(),
      name: this.newCategoryName!,
    };
    this.service
      .postCategory(category)
      .pipe(
        tap(() => {
          this.newCategoryId = null;
          this.newCategoryName = null;
        }),
      )
      .subscribe(this.alertSuccess);
  }

  updateCategory(category: ICategory): void {
    this.service.postCategory(category).subscribe(this.alertSuccess);
  }

  private refresh() {
    this.service
      .getFullAssignees()
      .subscribe((assignees) => (this.assignees = assignees));
    this.service
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  private alertSuccess = (): void => {
    this.refresh();
    alert('Hat geklappt!');
  };
}
