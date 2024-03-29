import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { PagingInfo } from '../model/paging-info';
import { environment } from '../../environments/environment';
import { Genre } from '../model/genre';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  alreadyFetched!: boolean;

  get genreList$(): BehaviorSubject<Genre[]> {
    if (!this.alreadyFetched) {
      this.getGenreList(0)
        .pipe(
          map(result => result.content),
          tap(() => (this.alreadyFetched = true))
        )
        .subscribe(next => {
          this._genreList$.next(next);
        });
    }
    return this._genreList$;
  }

  private _genreList$: BehaviorSubject<Genre[]> = new BehaviorSubject<Genre[]>([]);

  constructor(private http: HttpClient) {}

  getGenreList(page: number): Observable<PagingInfo<Genre>> {
    const params = {
      page,
      size: 100
    };
    return this.http.get<PagingInfo<Genre>>(`${environment.apiUrl}/genre/list`, { params });
  }

  createGenre(genre: Genre): Observable<Genre> {
    return this.http.post<Genre>(`${environment.apiUrl}/genre/create`, genre).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }

  updateGenre(genre: Genre, id: number): Observable<Genre> {
    return this.http.put<Genre>(`${environment.apiUrl}/genre/update/${id}`, genre).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }

  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/genre/delete/${id}`).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }
}
