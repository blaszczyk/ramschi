import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { Spinner, SpinnerService } from './spinner.service';
import { ScrollService } from './scroll.service';
import { CredentialService, RoleAware } from './login/credential.service';
import { LoginComponent } from './login/login.component';
import { RamschiFilterComponent } from './ramschi/ramschi-filter/ramschi-filter.component';
import { RamschiHeaderComponent } from './ramschi-header/ramschi-header.component';
import { RamschiService } from './ramschi/ramschi.service';
import { ItemListService } from './ramschi/item-list.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoginComponent,
    RamschiFilterComponent,
    RamschiHeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends RoleAware implements OnInit, AfterViewInit {
  title = 'ramschi-ui';

  @ViewChild('container')
  container!: ElementRef<HTMLDivElement>;

  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly router: Router,
    private readonly scroll: ScrollService,
    private readonly service: RamschiService,
    private readonly list: ItemListService,
    private recaptchaV3Service: ReCaptchaV3Service,
    credential: CredentialService,
  ) {
    super(credential);
  }

  showListView = false;

  get showSpinner(): boolean {
    return this.spinnerService.isVisible();
  }

  get spinners(): Spinner[] {
    return this.spinnerService.spinners;
  }

  get requiresLogin(): boolean {
    return this.credential.getRequiresLogin();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        this.showListView = !event.snapshot.routeConfig?.path;
      }
    });
    if (this.credential.hasCredentials()) {
      this.recaptchaV3Service.execute('login').subscribe((token) => {
        this.service.login(token).subscribe((response) => {
          if (response.success) {
            this.credential.setLoggedIn();
            this.credential.setRole(response.role);
            this.list.applyFilter();
          } else {
            this.credential.logout();
          }
        });
      });
    }
  }

  ngAfterViewInit(): void {
    this.scroll.setScrollElement(this.container.nativeElement);
  }
}
