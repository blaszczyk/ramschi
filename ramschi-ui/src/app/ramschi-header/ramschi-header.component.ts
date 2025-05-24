import { Component } from '@angular/core';
import { CredentialService, RoleAware } from '../login/credential.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ramschi-header',
  imports: [
    MatButtonModule,
    MatIconModule,],
  templateUrl: './ramschi-header.component.html',
  styleUrl: './ramschi-header.component.css'
})
export class RamschiHeaderComponent extends RoleAware {

  constructor(
    private readonly router: Router,
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
}
