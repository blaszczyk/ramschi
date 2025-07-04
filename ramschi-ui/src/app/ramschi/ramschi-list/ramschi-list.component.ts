import { Component, OnInit } from '@angular/core';
import { IItem } from '../domain';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { ScrollService } from '../../scroll.service';
import { CredentialService, RoleAware } from '../../login/credential.service';
import { ItemListService } from '../item-list.service';
import { SpinnerService } from '../../spinner.service';

@Component({
  selector: 'app-ramschi-list',
  imports: [MatGridListModule],
  templateUrl: './ramschi-list.component.html',
  styleUrl: './ramschi-list.component.scss',
})
export class RamschiListComponent extends RoleAware implements OnInit {
  get items(): IItem[] {
    return this.itemList.getItems();
  }

  constructor(
    private readonly scroll: ScrollService,
    private readonly spinner: SpinnerService,
    private readonly itemList: ItemListService,
    private readonly router: Router,
    credential: CredentialService,
  ) {
    super(credential);
  }

  ngOnInit(): void {
    if (!this.items.length) {
      this.spinner.show();
      this.itemList.requestItems().subscribe(() => {
        this.scroll.restorePosition();
        this.spinner.hide();
      });
    } else {
      this.scroll.restorePosition();
    }
  }

  getSymbolAssignee(item: IItem): string {
    const nrAssignees = item.assignees.length;
    return nrAssignees === 0 ? '' : nrAssignees === 1 ? '☝️' : '✌️';
  }

  navigateTo(item: IItem): void {
    this.scroll.storePosition();
    this.router.navigateByUrl('/ramsch/' + item.id);
  }
}
