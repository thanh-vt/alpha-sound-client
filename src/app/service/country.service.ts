import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagingInfo } from '../model/paging-info';
import { Country } from '../model/country';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  alreadyFetched!: boolean;

  get countryList$(): BehaviorSubject<Country[]> {
    this.getCountryList(0)
      .pipe(
        map(result => result.content),
        tap(() => (this.alreadyFetched = true))
      )
      .subscribe(next => {
        this._countryList$.next(next);
      });
    return this._countryList$;
  }

  private _countryList$: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>([]);

  constructor(private http: HttpClient) {}

  getCountryList(page: number): Observable<PagingInfo<Country>> {
    return this.http.get<PagingInfo<Country>>(`${environment.apiUrl}/country/list?page=${page}`);
  }

  createCountry(formData: FormData): Observable<HttpEvent<Country>> {
    return this.http.post<Country>(`${environment.apiUrl}/country/create`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateCountry(formData: FormData, id: number): Observable<Country> {
    return this.http.put<Country>(`${environment.apiUrl}/country/update?id=${id}`, formData);
  }

  deleteCountry(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/country/${id}`);
  }
}
