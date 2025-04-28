import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { Category, categoryDisplayName, IItem } from '../domain';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ramschi-detail',
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatGridListModule, FormsModule],
  templateUrl: './ramschi-detail.component.html',
  styleUrl: './ramschi-detail.component.css'
})
export class RamschiDetailComponent implements OnInit {

  categories: { id:Category, displayName: string }[] = Object.values(Category)
  .map(id => ({id, displayName: categoryDisplayName(id)}));

  item: IItem | null = null;

  constructor(
    private readonly service: RamschiService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: string | null = params.get('id');
      if (id) {
        this.service.getItem(id).subscribe(item => this.item = item);
      }
      else {
        this.item = {
          id: null,
          name: '',
          description: null,
          category: null,
          price: null,
          assignees: [],
          images: [],          
        }
      }
    })
  }

  saveItem(): void {
    this.service.postItem(this.item!).subscribe();
  }

  uploadNewImage(event: Event) {
    const file: File = (event.target as HTMLInputElement).files![0];
    this.service.postImage(this.item!.id!, file).subscribe();
  }

}
