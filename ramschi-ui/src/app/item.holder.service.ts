import { Injectable } from '@angular/core';
import { IFullItem } from './ramschi/domain';

@Injectable({
  providedIn: 'root',
})
export class ItemHolderService {
  private item: IFullItem | undefined;

  hasItem(): boolean {
    return this.item !== undefined;
  }
  getItem(): IFullItem | undefined {
    return this.item;
  }
  setItem(item: IFullItem): void {
    this.item = item;
  }
  clearItem(): void {
    this.item = undefined;
  }
}
