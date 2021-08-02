import { InjectionToken } from '@angular/core';

export const TOAST_DATA = new InjectionToken<LoadingData>('TOAST_DATA');

export class LoadingData {
  text?: string;
}
