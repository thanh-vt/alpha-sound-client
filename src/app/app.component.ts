import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './service/user-profile.service';
import { AuthService } from './service/auth.service';
import { LocationStrategy } from '@angular/common';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { environment } from '../environments/environment';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
  endpointMap = environment.pingEndpointConfig;

  constructor(
    private userService: UserProfileService,
    private authService: AuthService,
    private location: LocationStrategy,
    private toastService: VgToastService,
    private loaderService: VgLoaderService
  ) {
    // this.loaderService.loading(true);
    // this.loadingService.show({text: 'loading'});
    // setTimeout(() => {
    //   this.loadingService.hide();
    // }, 3000);
    // setTimeout(() => {
    //   this.toastService.success('Test', 'toast info');
    //   setTimeout(() => {
    //     this.toastService.error('Test', 'toast info');
    //     setTimeout(() => {
    //       this.toastService.warning('Test', 'toast info');
    //       setTimeout(() => {
    //         this.toastService.info('Test', 'toast info');
    //       }, 1000);
    //     }, 1000);
    //   }, 1000);
    // }, 1000);
    // localStorage.clear();
    // sessionStorage.clear();
    // location.onPopState(() => {
    //   window.location.reload();
    // });
    // let count = 0;
    // const loop = setInterval(() => {
    //   if (count === 5) {
    //     clearInterval(loop);
    //     return;
    //   }
    //   const data = new VgToastData();
    //   data.title = 'Test title';
    //   data.text = 'test vcl vcl vcl vclv vcvcvlcv vclvc dsd daljd fdj asdias dasijd asdkjnha asd vlcv cvlcv cvl ' + count;
    //   this.toastService.show(data, {
    //     type: TOAST_TYPE.ERROR,
    //     duration: 5000
    //   });
    //   count++;
    // }, 1000);
  }
}
