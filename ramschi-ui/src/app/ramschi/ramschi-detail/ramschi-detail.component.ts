import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { Category, categoryDisplayName, IItem } from '../domain';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../../spinner.service';

@Component({
  selector: 'app-ramschi-detail',
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatGridListModule, FormsModule],
  templateUrl: './ramschi-detail.component.html',
  styleUrl: './ramschi-detail.component.css'
})
export class RamschiDetailComponent implements OnInit {

  categories: { id:Category, displayName: string }[] = Object.values(Category)
  .map(id => ({id, displayName: categoryDisplayName(id)}));

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

  constructor(
    private readonly service: RamschiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly spinner: SpinnerService,
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
    })
  }

  saveItem(): void {
    this.spinner.show();
    this.service.postItem(this.item).subscribe(id => {
      this.spinner.hide();
      this.router.navigateByUrl('/ramsch/' + id);
    });
  }

  uploadNewImage(event: Event) {
    const file: File = (event.target as HTMLInputElement).files![0];
    this.spinner.show();
    this.service.postImage(this.item!.id!, file).subscribe(id => {
      this.item.images.push(id);
      this.spinner.hide();
    });
  }

}
