import {Component} from '@angular/core';
import {UserProfileService} from './service/user-profile.service';
import {AuthService} from './service/auth.service';
import {LocationStrategy} from '@angular/common';
import {ToastService} from './shared/service/toast.service';
import {LoadingService} from './shared/service/loading.service';

@Component({selector: 'app-root', templateUrl: 'app.component.html'})
export class AppComponent {

  constructor(private loadingService: LoadingService, private userService: UserProfileService,
              private authService: AuthService, private location: LocationStrategy,
              private toastService: ToastService) {
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
  }
}
