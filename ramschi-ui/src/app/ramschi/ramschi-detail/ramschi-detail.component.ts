import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { IItem } from '../domain';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ValueChangeEvent } from '@angular/forms';

@Component({
  selector: 'app-ramschi-detail',
  imports: [FormsModule],
  templateUrl: './ramschi-detail.component.html',
  styleUrl: './ramschi-detail.component.css'
})
export class RamschiDetailComponent implements OnInit {

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

  uploadNewImage(event: Event) {
    const file: File = (event.target as HTMLInputElement).files![0];
    this.service.postImage(this.item!.id!, file).subscribe();
  }

}
