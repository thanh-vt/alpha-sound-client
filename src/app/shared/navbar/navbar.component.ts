import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() logoutAction = new EventEmitter();
  isCollapsed: boolean;
  @Input() isLoggedIn: boolean;
  @Input() username: string;
  constructor(private authService: AuthService, private userservice: UserService) { }

  ngOnInit() {
    this.isCollapsed = true;
    this.isLoggedIn = (this.authService.currentUserValue != null);
    if (this.isLoggedIn) {
      this.userservice.getProfile().subscribe(user => {
          this.username = user.username;
        }
      );
    }
  }

  logoutClick() {
    this.logoutAction.emit();
  }

}
