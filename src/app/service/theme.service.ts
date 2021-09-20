import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { PagingInfo } from '../model/paging-info';
import { environment } from '../../environments/environment';
import { Theme } from '../model/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  alreadyFetched!: boolean;

  get themeList$(): BehaviorSubject<Theme[]> {
    if (!this.alreadyFetched) {
      this.getThemeList(0)
        .pipe(
          map(result => result.content),
          tap(() => (this.alreadyFetched = true))
        )
        .subscribe(next => {
          this._themeList$.next(next);
        });
    }
    return this._themeList$;
  }

  private _themeList$: BehaviorSubject<Theme[]> = new BehaviorSubject<Theme[]>([]);

  constructor(private http: HttpClient) {}

  getThemeList(page: number): Observable<PagingInfo<Theme>> {
    const params = {
      page,
      size: 100
    };
    return this.http.get<PagingInfo<Theme>>(`${environment.apiUrl}/theme/list`, { params });
  }

  createTheme(theme: Theme): Observable<Theme> {
    return this.http.post<Theme>(`${environment.apiUrl}/theme/create`, theme).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }

  updateTheme(theme: Theme, id: number): Observable<Theme> {
    return this.http.put<Theme>(`${environment.apiUrl}/theme/update/${id}`, theme).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }

  deleteTheme(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/theme/delete/${id}`).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }
}
