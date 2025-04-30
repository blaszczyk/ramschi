import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private scrollElement: HTMLElement | undefined;

  constructor() { }

  setScrollElement(scrollElement: HTMLElement) {
    this.scrollElement = scrollElement;
  }

  storePosition() {
    if(this.scrollElement) {
      const scrollTop = this.scrollElement.scrollTop + '';
      localStorage.setItem(KEY_SCROLL_POSITION, scrollTop);
    }
  }

  forgetPosition() {
    if(this.scrollElement) {
      localStorage.removeItem(KEY_SCROLL_POSITION);
    }
  }

  restorePosition() {
    const storedValue = localStorage.getItem(KEY_SCROLL_POSITION);
    if (this.scrollElement && storedValue) {
      setTimeout(() => {
        this.scrollElement!.scrollTop = parseFloat(storedValue);
        this.scrollElement!.scrollTo({ top: parseFloat(storedValue)});
      }, 1);
    }
  }
}

const KEY_SCROLL_POSITION = 'scroll-position';
