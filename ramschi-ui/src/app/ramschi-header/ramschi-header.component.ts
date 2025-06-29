import { Component } from '@angular/core';
import { CredentialService, RoleAware } from '../login/credential.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ItemHolderService } from '../item.holder.service';
import { DropDownAnimation } from './animations';

@Component({
  selector: 'app-ramschi-header',
  imports: [MatButtonModule, MatIconModule],
  animations: [DropDownAnimation],
  templateUrl: './ramschi-header.component.html',
  styleUrl: './ramschi-header.component.scss',
})
export class RamschiHeaderComponent extends RoleAware {
  showMenu = false;

  constructor(
    private readonly router: Router,
    private readonly itemHolder: ItemHolderService,
    credential: CredentialService,
  ) {
    super(credential);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
    if (this.showMenu) {
      window.addEventListener('click', () => (this.showMenu = false), {
        once: true,
      });
    }
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
    const title = this.itemHolder.getItem()?.name || 'Ramschi';
    const text = this.itemHolder.hasItem()
      ? `Schau mal, vielleicht wäre das was für dich: ${this.itemHolder.getItem()!.name}`
      : `Ramschi - Mütti Cyber Trödel`;
    const url = this.itemHolder.hasItem()
      ? window.location.href.replace(/amsch\//g, '/')
      : window.location.href;
    navigator.share({ title, text, url });
  }
}
