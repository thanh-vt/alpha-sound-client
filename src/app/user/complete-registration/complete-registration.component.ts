import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  error: boolean;
  message: string;
  countdownSec$: number;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      next => {
        const result = next.status;
        if (result === '0') {
          this.message = 'Account activated successfully';
          this.error = false;
          this.countdownSec$ = 5;
          const countdown = setInterval(() => {
            if (this.countdownSec$ === 0) {
              clearInterval(countdown);
              this.router.navigate(['/home']);
            } else {
              this.countdownSec$ = --this.countdownSec$;
            }}, 1000);
        } else if (result === '1') {
          this.message = 'Invalid Token';
          this.error = true;
        } else if (result === '2') {
          this.message = 'Token Expired';
          this.error = true;
        } else {
          this.message = '';
        }
      }, error => {
        console.log(error);
        this.error = true;
      }
    );
  }

}
