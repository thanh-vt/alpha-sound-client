import {Injectable, Injector} from '@angular/core';
import {Overlay, PositionStrategy} from '@angular/cdk/overlay';
import {LoadingData, TOAST_DATA} from '../layout/loading/loading-data';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoadingRef, TOAST_REF} from '../layout/loading/loading-ref';
import {LoadingComponent} from '../layout/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private positionStrategy: PositionStrategy = this.overlay.position()
    .global()
    .top('0')
    .left('0')
    .centerVertically()
    .centerHorizontally();
  private lastToast: LoadingRef;

  constructor(private overlay: Overlay, private parentInjector: Injector) {
  }

  private static getInjector(data: LoadingData, toastRef: LoadingRef, parentInjector: Injector): Injector {
    const providers = [
      {provide: TOAST_DATA, useValue: data},
      {provide: TOAST_REF, useValue: toastRef}
    ];
    return Injector.create({providers, parent: parentInjector});
  }

  show(data?: LoadingData): LoadingRef {
    const overlayRef = this.overlay.create({positionStrategy: this.positionStrategy});

    const toastRef = new LoadingRef(overlayRef);
    this.lastToast = toastRef;

    const injector = LoadingService.getInjector(data, toastRef, this.parentInjector);
    const toastPortal = new ComponentPortal(LoadingComponent, null, injector);

    overlayRef.attach(toastPortal);

    return toastRef;
  }

  hide(): void {
    if (this.lastToast) {
      this.lastToast.close();
    }
  }
}
