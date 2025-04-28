import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private visible: boolean = false;

  constructor() { }

  isVisible(): boolean {
    return this.visible;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

}
