import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { CredentialService } from './credential.service';
import { RamschiService } from '../ramschi/ramschi.service';
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatGridListModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private readonly credentials: CredentialService,
    private readonly service: RamschiService,
    private readonly spinner: SpinnerService,
  ) {}

  name: string = '';

  password: string = '';

  anonymous() {
    this.credentials.setInitialised();
  }

  login() {
    this.credentials.setCredentials(this.name, this.password);
    this.spinner.show();
    this.service.login()
    .subscribe((response) => {
      this.spinner.hide();
      if (response.success) {
        this.credentials.setRole(response.role);
        this.credentials.storeCredentials();
        this.credentials.setInitialised();
      }
      else {
        alert('Das hat leider nicht geklappt. Wenn Du Dein Passwort vergessen hast, wende Dich an den Admin Deines Vertrauens, der kann das zurücksetzen.');
      }
      });
  }
}
