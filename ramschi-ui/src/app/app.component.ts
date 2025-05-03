import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerService } from './spinner.service';
import { Router } from '@angular/router';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'ramschi-ui';

  @ViewChild('container')
  container!: ElementRef<HTMLDivElement>;

  constructor(
    private readonly spinner: SpinnerService,
    private readonly router: Router,
    private readonly scroll: ScrollService,
  ) {}

  get showSpinner(): boolean {
    return this.spinner.isVisible();
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  ngAfterViewInit(): void {
    this.scroll.setScrollElement(this.container.nativeElement);
  }
}
