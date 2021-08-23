import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../service/user-profile.service';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  countdownSec$: number;
  status = 0;

  constructor(private route: ActivatedRoute, private router: Router, private userProfileService: UserProfileService) {}

  ngOnInit() {
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has('token') && queryParamMap.has('email')) {
      const token = queryParamMap.get('token');
      const email = queryParamMap.get('email');
      this.userProfileService.confirmRegistration({ token, email }).subscribe(
        _ => {
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
        },
        error => {
          console.error(error);
          this.status = -1;
        }
      );
    } else {
      this.status = -1;
    }
  }
}
