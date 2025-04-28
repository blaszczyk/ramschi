import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { IBasicItem } from '../domain';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ramschi-list',
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatGridListModule, FormsModule],
  templateUrl: './ramschi-list.component.html',
  styleUrl: './ramschi-list.component.css'
})
export class RamschiListComponent implements OnInit {

  items: IBasicItem[] = [];

  constructor(private readonly service: RamschiService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.service.getItems().subscribe(items => this.items = items);
  }

  navigateToCreatePage(): void {
    this.router.navigateByUrl('/ramsch');
  }

}
