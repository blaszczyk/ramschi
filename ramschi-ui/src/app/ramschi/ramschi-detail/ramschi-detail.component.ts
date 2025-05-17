import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { ICategory, IItem } from '../domain';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../spinner.service';
import { CategoryService } from '../category.service';
import { AssigneeService } from '../assignee.service';
import { CredentialService, RoleAware } from '../../login/credential.service';
import { CommentsComponent } from "./comments/comments.component";
import { ItemListService } from '../item-list.service';
import { scaleImage } from '../util';

@Component({
  selector: 'app-ramschi-detail',
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatGridListModule,
    FormsModule,
    CommentsComponent
],
  templateUrl: './ramschi-detail.component.html',
  styleUrl: './ramschi-detail.component.css',
})
export class RamschiDetailComponent extends RoleAware implements OnInit {

  @ViewChild('newImage')
  newImageElement!: ElementRef<HTMLInputElement>;

  get assignees(): string[] {
    return this.assigneeService.getAll();
  }

  get categories(): ICategory[] {
    return this.categoryService.getAll();
  }

  item: IItem = {
    id: null,
    name: '',
    description: null,
    category: null,
    price: null,
    lastedit: 0,
    assignees: [],
    images: [],
  };

  initialized = false;

  pristine = true;

  constructor(
    private readonly service: RamschiService,
    private readonly itemList: ItemListService,
    private readonly categoryService: CategoryService,
    private readonly assigneeService: AssigneeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly spinner: SpinnerService,
    private readonly cdr: ChangeDetectorRef,
    credential: CredentialService,
  ) {
    super(credential);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id: string | null = params.get('id');
      if (id) {
        this.spinner.show();
        this.service.getItem(id).subscribe((item) => {
          this.item = item;
          this.initialized = true;
          this.spinner.hide();
        });
      } else {
        this.initialized = true;
      }
    });
  }

  get categoryName(): string {
    const category: ICategory | undefined = this.categories.filter(
      (c) => c.id === this.item.category,
    )[0];
    return category ? category.name : '';
  }

  get isAssigned(): boolean {
    return this.item.assignees.includes(this.assignee!);
  }

  saveDisabled(): boolean {
    return this.pristine || !this.item.name;
  }

  saveItem(): void {
    if (!this.saveDisabled()) {
      this.spinner.show();
      this.service.postItem(this.item).subscribe((id) => {
        this.spinner.hide();
        this.pristine = true;
        this.router.navigateByUrl('/ramsch/' + id);
        this.itemList.refresh();
      });
    }
  }

  uploadNewImage(event: Event) {
    const file: File = (event.target as HTMLInputElement).files![0];
    this.spinner.show();
    scaleImage(file, blob => {
      this.service.postImage(this.item!.id!, blob, file.type).subscribe((id) => {
        this.item.images.push(id);
        this.spinner.hide();
      this.itemList.refresh();
        this.cdr.detectChanges();
      });
    })
  }

  clickNewImage() {
    this.newImageElement.nativeElement.click();
  }

  changeAssignee(event: MatSelectChange<string[]>) {
    const currentAssignees = [...this.item.assignees];

    const newAssignees = event.value.filter(
      (a) => !currentAssignees.includes(a),
    );
    for (const assignee of newAssignees) {
      this.assign(assignee);
    }

    const deletedAssignees = currentAssignees.filter(
      (a) => !event.value.includes(a),
    );
    for (const assignee of deletedAssignees) {
      this.unassign(assignee);
    }
  }

  setDirty() {
    this.pristine = false;
  }

  assign(assignee: string): void {
    if (
      confirm(`Danke ${assignee} für Dein Interesse an ${this.item.name}!`)
    ) {
      this.spinner.show();
      this.service.putItemAssignee(this.item.id!, assignee).subscribe(() => {
        this.item.assignees.push(assignee);
        this.spinner.hide();
        this.itemList.refresh();
      });
    }
  }

  unassign(assignee: string): void {
    if (
      confirm(`Schade, ${assignee}, dass Dir ${this.item.name} egal ist!`)
    ) {
      this.spinner.show();
      this.service
        .deleteItemAssignee(this.item.id!, assignee)
        .subscribe(() => {
          const index = this.item.assignees.indexOf(assignee);
          this.item.assignees.splice(index, 1);
          this.spinner.hide();
          this.itemList.refresh();
        });
    }
  }
}
