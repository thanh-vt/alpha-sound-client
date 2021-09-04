import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../service/user-profile.service';
import { Subscription } from 'rxjs';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  countdownSec$: number;
  status = 0;
  subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userProfileService: UserProfileService,
    private loaderService: VgLoaderService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async queryParamMap => {
        if (queryParamMap.has('token') && queryParamMap.has('email')) {
          const token = queryParamMap.get('token');
          const email = queryParamMap.get('email');
          try {
            this.loaderService.loading(true);
            await this.userProfileService.confirmRegistration({ token, email }).toPromise();
            this.status = 1;
            this.countdownSec$ = 5;
            const countdown = setInterval(() => {
              if (this.countdownSec$ === 0) {
                clearInterval(countdown);
                this.router.navigate(['/home']);
              } else {
                this.countdownSec$ = --this.countdownSec$;
              }
            }, 1000);
          } catch (e) {
            console.error(e);
            this.status = -1;
          } finally {
            this.loaderService.loading(false);
          }
        } else {
          this.status = -1;
        }
      })
    );
  }
}
