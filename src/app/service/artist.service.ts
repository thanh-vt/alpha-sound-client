import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {filter, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(private http: HttpClient) { }

  searchArtist(name: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/artist/search?name=${name}`).pipe(
      tap((response: any) => {
        response
          .map(artist => artist.name);
          // .filter(artist => artist.name.includes(filter.name));
        // return response;
      })
    );
  }
}
