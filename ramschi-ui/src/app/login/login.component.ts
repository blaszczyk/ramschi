import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { CredentialService } from './credential.service';
import { RamschiService } from '../ramschi/ramschi.service';
import { SpinnerService } from '../spinner.service';
import { ItemListService } from '../ramschi/item-list.service';

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
    private readonly itemList: ItemListService,
  ) {}

  name = '';

  password = '';

  anonymous() {
    this.spinner.show();
    this.itemList.requestItems().subscribe(() => {
      this.spinner.hide();
      this.credentials.setInitialised();
    });
  }

  login() {
    this.credentials.setCredentials(this.name, this.password);
    this.spinner.show();
    this.service.login().subscribe((response) => {
      if (response.success) {
        this.credentials.setRole(response.role);
        this.credentials.storeCredentials();
        this.itemList.requestItems().subscribe(() => {
          this.credentials.setInitialised();
          this.spinner.hide();
        });
      } else {
        alert(
          'Das hat leider nicht geklappt. Wenn Du Dein Passwort vergessen hast, wende Dich an den Admin Deines Vertrauens.',
        );
        this.spinner.hide();
      }
    });
  }
}
