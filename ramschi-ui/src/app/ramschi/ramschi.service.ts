import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ICategory, IBasicItem, IItem, ILoginResponse, IComment } from './domain';
import { CredentialService } from '../login/credential.service';

@Injectable({
  providedIn: 'root',
})
export class RamschiService {
  constructor(
    private readonly http: HttpClient,
    private readonly credential: CredentialService,
  ) {}

  getItems(
    filter = '',
    category: string | undefined = undefined,
    assignee: string | undefined = undefined,
    latestFirst = false,
  ): Observable<IItem[]> {
    let params = new HttpParams();
    if (filter) {
      params = params.set('filter', filter);
    }
    if (category) {
      params = params.set('category', category);
    }
    if (assignee) {
      params = params.set('assignee', assignee);
    }
    if (latestFirst) {
      params = params.set('latestFirst', true);
    }
    return this.http.get<IItem[]>('/api/item', { params });
  }

  getItem(id: string): Observable<IItem> {
    return this.http.get<IItem>('/api/item/' + id);
  }

  postItem(item: IBasicItem): Observable<string> {
    return this.http.post<string>('/api/item', item, {
      headers: this.getHeaders(),
    });
  }

  deleteItem(item: IBasicItem): Observable<void> {
    return this.http.delete<void>('/api/item/' + item.id, {
      headers: this.getHeaders(),
    });
  }

  getAssignees(): Observable<string[]> {
    return this.http.get<string[]>('/api/assignee');
  }

  putItemAssignee(itemId: string, assignee: string): Observable<void> {
    return this.http.put<void>(
      '/api/item/' + itemId + '/assignee/' + assignee,
      null,
      { headers: this.getHeaders() },
    );
  }

  deleteItemAssignee(itemId: string, assignee: string): Observable<void> {
    return this.http.delete<void>(
      '/api/item/' + itemId + '/assignee/' + assignee,
      { headers: this.getHeaders() },
    );
  }

  postAssignee(name: string): Observable<void> {
    return this.http.post<void>('/api/assignee/' + name, null, {
      headers: this.getHeaders(),
    });
  }

  deleteAssignee(name: string): Observable<void> {
    return this.http.delete<void>('/api/assignee/' + name, {
      headers: this.getHeaders(),
    });
  }

  resetPassword(name: string): Observable<void> {
    return this.http.delete<void>('/api/assignee/' + name + '/password', {
      headers: this.getHeaders(),
    });
  }

  postImage(itemId: string, file: File): Observable<string> {
    return this.http.post<string>('/api/item/' + itemId + '/image', file, {
      headers: {
        'content-type': file.type,
        'X-RAMSCHI-ASSIGNEE': this.credential.getAuthHeader(),
      },
    });
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>('/api/image/' + id, {
      headers: this.getHeaders(),
    });
  }

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>('/api/category');
  }

  postCategory(category: ICategory): Observable<void> {
    return this.http.post<void>('/api/category', category, {
      headers: this.getHeaders(),
    });
  }

  login(): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/api/assignee/login', null, {
      headers: this.getHeaders(),
    });
  }

  getComments(itemId: string): Observable<IComment[]> {
    return this.http.get<IComment[]>('/api/comment/' + itemId);
  }

  postComment(comment: IComment): Observable<IComment> {
    return this.http.post<IComment>('/api/comment', comment, {
      headers: this.getHeaders(),
    });
 }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-RAMSCHI-ASSIGNEE': this.credential.getAuthHeader(),
    });
  }
}
