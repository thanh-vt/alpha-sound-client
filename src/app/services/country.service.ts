import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

  getCountryList(page: number) {
    return this.http.get<any>(`${environment.apiUrl}/country/list?page=${page}`);
  }
}
