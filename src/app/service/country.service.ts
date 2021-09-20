import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    const params = {
      page,
      size: 100
    };
    return this.http.get<PagingInfo<Country>>(`${environment.apiUrl}/country/list`, { params });
  }

  createCountry(country: Country): Observable<Country> {
    return this.http.post<Country>(`${environment.apiUrl}/country/create`, country).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }

  updateCountry(country: Country, id: number): Observable<Country> {
    return this.http.put<Country>(`${environment.apiUrl}/country/update/${id}`, country).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }

  deleteCountry(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/country/${id}`).pipe(
      tap(() => {
        this.alreadyFetched = false;
      })
    );
  }
}
