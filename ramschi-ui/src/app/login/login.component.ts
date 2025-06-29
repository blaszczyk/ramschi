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
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private readonly credential: CredentialService,
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
      this.credential.setLoggedIn();
    });
  }

  login() {
    this.credential.setCredentials(this.name, this.password);
    this.spinner.show();
    this.service.login().subscribe((response) => {
      if (response.success) {
        this.credential.setRole(response.role);
        this.credential.storeCredentials();
        this.itemList.requestItems().subscribe(() => {
          this.credential.setLoggedIn();
          this.spinner.hide();
        });
      } else {
        alert(
          'Der Name ist schon vergeben. Wenn Du Dein Passwort vergessen hast, wende Dich an den Admin Deines Vertrauens.',
        );
        this.spinner.hide();
      }
    });
  }
}
