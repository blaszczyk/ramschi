import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { SpinnerService } from './spinner.service';
import { ScrollService } from './scroll.service';
import { CredentialService, RoleAware } from './login/credential.service';
import { LoginComponent } from './login/login.component';
import { RamschiFilterComponent } from './ramschi/ramschi-filter/ramschi-filter.component';
import { RamschiHeaderComponent } from "./ramschi-header/ramschi-header.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoginComponent,
    RamschiFilterComponent,
    RamschiHeaderComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent extends RoleAware implements OnInit, AfterViewInit {
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

  showFilter: boolean = false;

  get showSpinner(): boolean {
    return this.spinner.isVisible();
  }

  get loggedIn(): boolean {
    return this.credential.isInitialised();
  }

  get spinnerPosition(): string {
    return `translate(${this.spinner.x}px, ${this.spinner.y}px)`;
  };

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
