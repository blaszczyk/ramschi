import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { IBasicItem } from '../domain';

@Component({
  selector: 'app-ramschi-list',
  imports: [],
  templateUrl: './ramschi-list.component.html',
  styleUrl: './ramschi-list.component.css'
})
export class RamschiListComponent implements OnInit {

  items: IBasicItem[] = [];

  constructor(private readonly service: RamschiService) {}

  ngOnInit(): void {
    this.service.getItems().subscribe(items => this.items = items);
  }

}
