import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment } from '../model/comment';
import { HttpClient } from '@angular/common/http';
import { PagingInfo } from '../model/paging-info';
import { CommentType } from '../constant/comment-type';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  commentList(id: number, type: CommentType, page = 0, size = 5): Observable<PagingInfo<Comment>> {
    const params = {
      id,
      page,
      size
    };
    return this.http.get<PagingInfo<Comment>>(`${environment.apiUrl}/comment/${type}`, { params });
  }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUrl}/comment`, comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.http.patch<Comment>(`${environment.apiUrl}/comment`, comment);
  }

  deleteComment(commentId: number, type: CommentType): Observable<void> {
    const params = {
      ['comment-id']: commentId,
      type
    };
    return this.http.delete<void>(`${environment.apiUrl}/comment`, { params });
  }
}
