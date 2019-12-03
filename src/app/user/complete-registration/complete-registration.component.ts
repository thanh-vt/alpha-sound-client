import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  error: boolean;
  message: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      next => {
        const result = next.status;
        if (result === '0') {
          this.message = 'Registered Successfully!';
          this.error = false;
        } else if (result === '1') {
          this.message = 'Invalid Token!';
          this.error = true;
        } else if (result === '2') {
          this.message = 'Token Expired!';
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
