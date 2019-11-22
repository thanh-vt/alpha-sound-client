import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Album} from '../models/album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient) { }

  albumList(page?: number, sort?: string) {
    let requestUrl = `${environment.apiUrl}/album/list`;
    if (page || sort) {
      requestUrl = requestUrl + `?`;
      if (page) {
        requestUrl = requestUrl + `page=${page}`;
        if (sort) {
          requestUrl = requestUrl + `&`;
        }
      }
      if (sort) {
        requestUrl = requestUrl + `sort=${sort}`;
      }
    }
    // console.log(requestUrl);
    return this.http.get<any>(requestUrl);
  }

  albumDetail(id: number) {
    return this.http.get<Album>(`${environment.apiUrl}/album/detail?id=${id}`);
  }
}
