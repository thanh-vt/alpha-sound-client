import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PagingInfo } from '../model/paging-info';
import { environment } from '../../environments/environment';
import { Tag } from '../model/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) {}

  getTagList(page: number): Observable<PagingInfo<Tag>> {
    const params = {
      page,
      size: 10
    };
    return this.http.get<PagingInfo<Tag>>(`${environment.apiUrl}/tag/list`, { params });
  }

  createTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`${environment.apiUrl}/tag/create`, tag);
  }

  updateTag(tag: Tag, id: number): Observable<Tag> {
    return this.http.put<Tag>(`${environment.apiUrl}/tag/update/${id}`, tag);
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/tag/delete/${id}`);
  }
}
