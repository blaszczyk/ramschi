import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { FormsModule } from '@angular/forms';
import { IAssignee, ICategory, Role } from '../domain';
import { CredentialService, RoleAware } from '../../login/credential.service';

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
      this.service.deleteAssignee(name).subscribe(() => {
        this.refresh();
      });
    }
  }

  resetPassword(name: string) {
    if (confirm('Passwort von ' + name + ' zurücksetzen?')) {
      this.service.resetPassword(name).subscribe(() => {
        alert('Hat geklappt!');
      });
    }
  }

  toggleRole(assignee: IAssignee) {
    const newRole = assignee.role === Role.ASSIGNEE ? Role.CONTRIBUTOR : Role.ASSIGNEE;
    this.service.putAssigneeRole(assignee.name, newRole).subscribe(() => {
      alert('Hat geklappt!');
      this.refresh();
    });
  }

  createNewCategory(): void {
    const category: ICategory = {
      id: this.newCategoryId!.toUpperCase(),
      name: this.newCategoryName!,
    };
    this.service.postCategory(category).subscribe(() => {
      this.newCategoryId = null;
      this.newCategoryName = null;
      this.refresh();
    });
  }

  updateCategory(category: ICategory): void {
    this.service.postCategory(category).subscribe(() => {
      this.refresh();
      alert('Hat geklappt!');
    });
  }

  private refresh() {
    this.service
      .getFullAssignees()
      .subscribe((assignees) => (this.assignees = assignees));
    this.service
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }
}
