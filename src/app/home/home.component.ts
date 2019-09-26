import { Component, OnInit } from '@angular/core';
import {User} from '../model/user';
import {UserService} from '../service/user.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loading = true;
    this.userService.getProfile().pipe(first()).subscribe(user => {
      this.loading = false;
      this.user = user;
    });
  }

}
