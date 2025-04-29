import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { Category, categoryDisplayName, IItem } from '../domain';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../spinner.service';
import { scaleImage } from '../util';

@Component({
  selector: 'app-ramschi-detail',
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatGridListModule, FormsModule],
  templateUrl: './ramschi-detail.component.html',
  styleUrl: './ramschi-detail.component.css'
})
export class RamschiDetailComponent implements OnInit {

  @ViewChild('newImage')
  newImageElement!: ElementRef<HTMLInputElement> ;

  categories: { id:Category, displayName: string }[] = Object.values(Category)
  .map(id => ({id, displayName: categoryDisplayName(id)}));

  assignees: string[] = [];

  item: IItem = {
    id: null,
    name: '',
    description: null,
    category: null,
    price: null,
    assignees: [],
    images: [],          
  };

  initialized = false;

  pristine = true;

  constructor(
    private readonly service: RamschiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly spinner: SpinnerService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: string | null = params.get('id');
      if (id) {
        this.spinner.show();
        this.service.getItem(id).subscribe(item => {
          this.item = item;
          this.initialized = true;
          this.spinner.hide();
        });
      }
      else {
        this.initialized = true;
      }
    });
    this.service.getAssignees().subscribe(assignees => this.assignees = assignees);
  }

  saveDisabled(): boolean {
    return this.pristine || !this.item.name;
  }

  saveItem(): void {
    if (!this.saveDisabled()) {
      this.spinner.show();
      this.service.postItem(this.item).subscribe(id => {
        this.spinner.hide();
        this.pristine = true;
        this.router.navigateByUrl('/ramsch/' + id);
      });
    }
  }

  uploadNewImage(event: Event) {
    const file: File = (event.target as HTMLInputElement).files![0];
    this.spinner.show();
    scaleImage(file, blob => {
      this.service.postImage(this.item!.id!, blob, file.type).subscribe(id => {
        this.item.images.push(id);
        this.spinner.hide();
        this.cdr.detectChanges();
      });
    })
  }

  clickNewImage() {
    this.newImageElement.nativeElement.click();
  }
  
  changeAssignee(event: MatSelectChange<string[]>) {

    const currentAssignees = [... this.item.assignees];

    const newAssignees = event.value.filter(a => !currentAssignees.includes(a));
    for (let assignee of newAssignees) {
      this.spinner.show();
      this.service.putItemAssignee(this.item.id!, assignee).subscribe(() => {
        this.item.assignees.push(assignee);
        this.spinner.hide();
      });
    }

    const deletedAssignees = currentAssignees.filter(a => !event.value.includes(a));
    for (let assignee of deletedAssignees) {
      this.spinner.show();
      this.service.deleteItemAssignee(this.item.id!, assignee).subscribe(() => {
        const index = this.item.assignees.indexOf(assignee);
        this.item.assignees.splice(index, 1);
        this.spinner.hide();
      });
    }
  }

  setDirty() {
    this.pristine = false;
  }

}
