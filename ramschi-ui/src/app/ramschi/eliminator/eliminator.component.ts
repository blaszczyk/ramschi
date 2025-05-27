import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { IItem } from '../domain';
import { CredentialService, RoleAware } from '../../login/credential.service';

@Component({
  selector: 'app-eliminator',
  imports: [],
  templateUrl: './eliminator.component.html',
  styleUrl: './eliminator.component.css',
})
export class EliminatorComponent extends RoleAware implements OnInit {
  items: IItem[] = [];

  constructor(
    private readonly service: RamschiService,
    credential: CredentialService,
  ) {
    super(credential);
  }

  ngOnInit(): void {
    this.service.getItems(true).subscribe((items) => (this.items = items));
  }

  deleteItem(item: IItem) {
    if (confirm(item.name + ' wirklich löschen?')) {
      this.service.deleteItem(item).subscribe();
    }
  }

  deleteImage(id: string) {
    if (confirm('Bild wirklich löschen?')) {
      this.service.deleteImage(id).subscribe();
    }
  }
}
