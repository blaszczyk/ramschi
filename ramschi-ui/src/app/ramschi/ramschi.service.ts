import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  ICategory,
  IPlainItem,
  IItem,
  ILoginResponse,
  IComment,
  Role,
  IAssignee,
  IFullItem,
} from './domain';
import { CredentialService } from '../login/credential.service';

@Injectable({
  providedIn: 'root',
})
export class RamschiService {
  constructor(
    private readonly http: HttpClient,
    private readonly credential: CredentialService,
  ) {}

  getItems(): Observable<IItem[]> {
    return this.http.get<IItem[]>('/api/item');
  }

  getItem(id: string): Observable<IFullItem> {
    return this.http.get<IFullItem>('/api/item/' + id);
  }

  postItem(item: IPlainItem): Observable<string> {
    return this.http.post<string>('/api/item', item, {
      headers: this.getHeaders(),
    });
  }

  deleteItem(item: IPlainItem): Observable<void> {
    return this.http.delete<void>('/api/item/' + item.id, {
      headers: this.getHeaders(),
    });
  }

  getAssignees(): Observable<string[]> {
    return this.http.get<string[]>('/api/assignee');
  }

  getFullAssignees(): Observable<IAssignee[]> {
    return this.http.get<IAssignee[]>('/api/assignee/full', {
      headers: this.getHeaders(),
    });
  }

  putItemAssignee(itemId: string, assignee: string): Observable<void> {
    return this.http.put<void>(
      '/api/item/' + itemId + '/assignee/' + encodeURIComponent(assignee),
      null,
      { headers: this.getHeaders() },
    );
  }

  deleteItemAssignee(itemId: string, assignee: string): Observable<void> {
    return this.http.delete<void>(
      '/api/item/' + itemId + '/assignee/' + encodeURIComponent(assignee),
      { headers: this.getHeaders() },
    );
  }

  deleteAssignee(name: string): Observable<void> {
    return this.http.delete<void>('/api/assignee/' + encodeURIComponent(name), {
      headers: this.getHeaders(),
    });
  }

  resetPassword(name: string): Observable<void> {
    return this.http.delete<void>(
      '/api/assignee/' + encodeURIComponent(name) + '/password',
      {
        headers: this.getHeaders(),
      },
    );
  }

  putAssigneeRole(name: string, role: Role): Observable<void> {
    return this.http.put<void>(
      `/api/assignee/${encodeURIComponent(name)}/role/${role}`,
      null,
      {
        headers: this.getHeaders(),
      },
    );
  }

  getItemsForAssignee(name: string): Observable<IItem[]> {
    return this.http.get<IItem[]>(
      '/api/item/assignee/' + encodeURIComponent(name),
      {
        headers: this.getHeaders(),
      },
    );
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

  postComment(comment: IComment): Observable<IComment> {
    return this.http.post<IComment>('/api/comment', comment, {
      headers: this.getHeaders(),
    });
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>('/api/comment/' + id, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-RAMSCHI-ASSIGNEE': this.credential.getAuthHeader(),
    });
  }
}
