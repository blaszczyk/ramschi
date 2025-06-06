import { Injectable } from '@angular/core';
import { IItem } from './ramschi/domain';

@Injectable({
  providedIn: 'root',
})
export class ItemHolderService {
  private item: IItem | undefined;

  hasItem(): boolean {
    return this.item !== undefined;
  }
  getItem(): IItem | undefined {
    return this.item;
  }
  setItem(item: IItem): void {
    this.item = item;
  }
  clearItem(): void {
    this.item = undefined;
  }
}
