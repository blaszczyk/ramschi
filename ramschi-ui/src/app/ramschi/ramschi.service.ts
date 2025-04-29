import { Injectable } from '@angular/core';
import { flatMap, from, map, mergeMap, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category, IBasicItem, IItem } from './domain';

@Injectable({
  providedIn: 'root'
})
export class RamschiService {

  constructor(private readonly http: HttpClient) { }

  getItems(filter: string = '', category: Category | undefined = undefined): Observable<IItem[]> {
    let params = new HttpParams();
    if (filter) {
      params = params.set('filter', filter);
    }
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<IItem[]>('/api/item', { params })
  }

  getItem(id: string): Observable<IItem> {
    return this.http.get<IItem>('/api/item/' + id);
  }

  postItem(item: IBasicItem): Observable<string> {
    return this.http.post<string>('/api/item', item);
  }

  deleteItem(item: IBasicItem): Observable<void> {
    return this.http.delete<void>('/api/item/' + item.id);
  }

  getAssignees(): Observable<string[]> {
    return this.http.get<string[]>('/api/assignee');
  }

  putItemAssignee(itemId: string, assignee: string): Observable<void> {
    return this.http.put<void>('/api/item/' + itemId + '/assignee/' + assignee, null);
  }

  deleteItemAssignee(itemId: string, assignee: string): Observable<void> {
    return this.http.delete<void>('/api/item/' + itemId + '/assignee/' + assignee);
  }

  postAssignee(name: string): Observable<void> {
    return this.http.post<void>('/api/assignee/' + name, null);
  }

  deleteAssignee(name: string): Observable<void> {
    return this.http.delete<void>('/api/assignee/' + name);
  }

  postImage(itemId: string, blob: Blob, type: string): Observable<string> {
    return this.http.post<string>('/api/item/' + itemId + '/image', blob, 
      { headers: { 'content-type': type} }
    );
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>('/api/image/' + id);
  }

}
