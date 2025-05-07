import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerService } from './spinner.service';
import { Router } from '@angular/router';
import { ScrollService } from './scroll.service';
import { CredentialService, RoleAware } from './login/credential.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatProgressSpinnerModule,
    MatButtonModule,
    LoginComponent,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent extends RoleAware implements AfterViewInit {
  title = 'ramschi-ui';

  @ViewChild('container')
  container!: ElementRef<HTMLDivElement>;

  constructor(
    private readonly spinner: SpinnerService,
    private readonly router: Router,
    private readonly scroll: ScrollService,
    credential: CredentialService,
  ) {
    super(credential);
  }

  get showSpinner(): boolean {
    return this.spinner.isVisible();
  }

  get loggedIn(): boolean {
    return this.credential.isInitialised();
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  logout(): void {
    if (this.credential.isAssignee()) {
      const message = `${this.credential.getAssignee()} abmelden?`;
      if (confirm(message)) {
        this.credential.logout();
      }
    } else {
      this.credential.logout();
    }
  }

  ngAfterViewInit(): void {
    this.scroll.setScrollElement(this.container.nativeElement);
  }
}
