import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Album} from '../model/album';
import {Observable} from 'rxjs';
import {PagingInfo} from '../model/paging-info';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient) {
  }

  albumList(page: number, sort = 'asc'): Observable<PagingInfo<Album>> {
    const requestUrl = `${environment.apiUrl}/album/list`;
    const params: any = {page, sort};
    return this.http.get<PagingInfo<Album>>(requestUrl, {params});
  }

  albumDetail(id: any) {
    const params = {id};
    return this.http.get<Album>(`${environment.apiUrl}/album/detail`, {params});
  }
}
