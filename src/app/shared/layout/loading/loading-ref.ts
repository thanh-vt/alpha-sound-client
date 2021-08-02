import { OverlayRef } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';
import { LoadingData } from './loading-data';

export const TOAST_REF = new InjectionToken<LoadingData>('TOAST_REF');

export class LoadingRef {
  constructor(readonly overlay: OverlayRef) {}

  close(): void {
    this.overlay.dispose();
  }

  isVisible(): HTMLElement {
    return this.overlay && this.overlay.overlayElement;
  }

  getPosition(): DOMRect {
    return this.overlay.overlayElement.getBoundingClientRect();
  }
}
