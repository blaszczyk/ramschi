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
import { RamschiFooterComponent } from './ramschi-footer/ramschi-footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoginComponent,
    RamschiFilterComponent,
    RamschiHeaderComponent,
    RamschiFooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent extends RoleAware implements OnInit, AfterViewInit {
  title = 'ramschi-ui';

  @ViewChild('container')
  container!: ElementRef<HTMLDivElement>;

  constructor(
    private readonly spinnerService: SpinnerService,
    private readonly router: Router,
    private readonly scroll: ScrollService,
    credential: CredentialService,
  ) {
    super(credential);
  }

  showFilter = false;

  get showSpinner(): boolean {
    return this.spinnerService.isVisible();
  }

  get spinners(): Spinner[] {
    return this.spinnerService.spinners;
  }

  get loggedIn(): boolean {
    return this.credential.isInitialised();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        this.showFilter = !event.snapshot.routeConfig?.path;
      }
    });
  }

  ngAfterViewInit(): void {
    this.scroll.setScrollElement(this.container.nativeElement);
  }
}
