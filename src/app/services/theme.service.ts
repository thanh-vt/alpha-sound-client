import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public darkThemeSubject = new BehaviorSubject(true);
  public darkThemeSubjectValue = this.darkThemeSubject.asObservable();

  constructor() { }
}
