import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerService } from './spinner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ramschi-ui';

  constructor(private readonly spinner: SpinnerService,
    private readonly router: Router
  ) {}

  get showSpinner(): boolean {
    return this.spinner.isVisible();
  };
  
  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

}
