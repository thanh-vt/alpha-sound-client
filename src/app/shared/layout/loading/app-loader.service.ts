import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AppLoaderService {
  private loadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  loading(value = false) {
    this.loadingSubject$.next(value);
  }

  getLoader(): Observable<boolean> {
    return this.loadingSubject$;
  }
}
