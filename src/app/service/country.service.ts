import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PagingInfo } from '../model/paging-info';
import { Country } from '../model/country';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  countryList$: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>([]);

  constructor(private http: HttpClient) {
    this.getCountryList(0)
      .pipe(map(result => result.content))
      .subscribe(next => {
        this.countryList$.next(next);
      });
  }

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
