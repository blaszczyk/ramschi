import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { ICategory, IFullItem, IPlainItem } from '../domain';
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
import { CommentsComponent } from './comments/comments.component';
import { ItemListService } from '../item-list.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ItemHolderService } from '../../item.holder.service';

@Component({
  selector: 'app-ramschi-detail',
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatGridListModule,
    MatCheckboxModule,
    FormsModule,
    CommentsComponent,
  ],
  templateUrl: './ramschi-detail.component.html',
  styleUrl: './ramschi-detail.component.scss',
})
export class RamschiDetailComponent
  extends RoleAware
  implements OnInit, OnDestroy
{
  @ViewChild('newImage')
  newImageElement!: ElementRef<HTMLInputElement>;

  get assignees(): string[] {
    return this.assigneeService.getAll();
  }

  get categories(): ICategory[] {
    return this.categoryService.getAll();
  }

  item: IFullItem = {
    id: null,
    name: '',
    description: null,
    category: null,
    sold: false,
    assignees: [],
    images: [],
    comments: [],
  };

  initialized = false;

  soldSaved = false;

  pristine = true;

  constructor(
    private readonly service: RamschiService,
    private readonly itemList: ItemListService,
    private readonly categoryService: CategoryService,
    private readonly assigneeService: AssigneeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly spinner: SpinnerService,
    private readonly itemHolder: ItemHolderService,
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
          this.soldSaved = item.sold;
          this.spinner.hide();
          this.itemHolder.setItem(item);
        });
      } else {
        this.initialized = true;
        this.itemHolder.clearItem();
      }
    });
  }

  ngOnDestroy(): void {
    this.itemHolder.clearItem();
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
    this.spinner.show();
    const plainItem: IPlainItem = {
      id: this.item.id,
      name: this.item.name,
      description: this.item.description,
      category: this.item.category,
      sold: this.item.sold,
    };
    this.service.postItem(plainItem).subscribe((id) => {
      this.router.navigateByUrl('/ramsch/' + id);
      this.itemList.requestItems().subscribe(() => {
        this.pristine = true;
        this.soldSaved = plainItem.sold;
        this.spinner.hide();
      });
    });
  }

  uploadNewImage(event: Event) {
    const file: File = (event.target as HTMLInputElement).files![0];
    this.spinner.show();
    this.service.postImage(this.item!.id!, file).subscribe((id) => {
      this.item.images.push(id);
      this.itemList.requestItems().subscribe(() => {
        this.spinner.hide();
      });
    });
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
    if (confirm(`Danke ${assignee} für Dein Interesse an ${this.item.name}!`)) {
      this.spinner.show();
      this.service.putItemAssignee(this.item.id!, assignee).subscribe(() => {
        this.item.assignees.push(assignee);
        this.itemList.requestItems().subscribe(() => {
          this.spinner.hide();
        });
      });
    }
  }

  unassign(assignee: string): void {
    if (confirm(`Schade, ${assignee}, dass Dir ${this.item.name} egal ist!`)) {
      this.spinner.show();
      this.service.deleteItemAssignee(this.item.id!, assignee).subscribe(() => {
        const index = this.item.assignees.indexOf(assignee);
        this.item.assignees.splice(index, 1);
        this.itemList.requestItems().subscribe(() => {
          this.spinner.hide();
        });
      });
    }
  }
}
