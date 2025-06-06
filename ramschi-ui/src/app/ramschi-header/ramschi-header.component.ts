import { Component } from '@angular/core';
import { CredentialService, RoleAware } from '../login/credential.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ItemHolderService } from '../item.holder.service';

@Component({
  selector: 'app-ramschi-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './ramschi-header.component.html',
  styleUrl: './ramschi-header.component.css',
})
export class RamschiHeaderComponent extends RoleAware {
  constructor(
    private readonly router: Router,
    private readonly itemHolder: ItemHolderService,
    credential: CredentialService,
  ) {
    super(credential);
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  logout(): void {
    if (this.credential.isAssignee()) {
      const message = `${this.credential.getAssignee()} abmelden?`;
      if (confirm(message)) {
        this.credential.logout();
        this.navigateTo('/');
      }
    } else {
      this.credential.logout();
      this.navigateTo('/');
    }
  }

  canShare(): boolean {
    return navigator.share !== undefined;
  }

  share(): void {
    const title = this.itemHolder.hasItem()
      ? this.itemHolder.getItem()!.name
      : 'Ramschi';
    const text = this.itemHolder.hasItem()
      ? `Schau mal, vielleicht wäre das was für dich: ${this.itemHolder.getItem()!.name}`
      : `Ramschi - Der Mütti Cyber Trödel`;
    const url = window.location.href;
    navigator.share({ title, text, url });
  }
}
