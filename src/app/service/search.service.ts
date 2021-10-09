import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SearchSummary } from '../model/search-summary';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {}

  search(q: string): Observable<SearchSummary> {
    return this.http.get<SearchSummary>(`${environment.apiUrl}/es/search`, { params: { q } });
  }

  reloadMapping(indexName: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/es/reload-mapping`, null, { params: { ['index-name']: indexName } });
  }

  markForSync(indexName: string, option: { id: number; createTime: Date; updateTime: Date }): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/es/mark-for-sync`, option, { params: { ['index-name']: indexName } });
  }

  clearIndex(indexName: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/es/clear`, { params: { ['index-name']: indexName } });
  }

  resetIndex(indexName: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/es/reset`, { params: { ['index-name']: indexName } });
  }
}
