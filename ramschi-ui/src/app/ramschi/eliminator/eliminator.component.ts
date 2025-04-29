import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { IItem } from '../domain';

@Component({
  selector: 'app-eliminator',
  imports: [],
  templateUrl: './eliminator.component.html',
  styleUrl: './eliminator.component.css'
})
export class EliminatorComponent implements OnInit {

  items: IItem[] = [];

  constructor(private readonly service: RamschiService){}

  ngOnInit(): void {
    this.service.getItems().subscribe(items => this.items = items);
  }

  deleteItem(item: IItem) {
    this.service.deleteItem(item).subscribe();
  }

  deleteImage(id: string) {
    this.service.deleteImage(id).subscribe();
  }

}
