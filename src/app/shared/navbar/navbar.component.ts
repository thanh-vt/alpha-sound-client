import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() logoutAction = new EventEmitter();
  isCollapsed: boolean;
  constructor(private authenticationService: AuthService) { }

  ngOnInit() {
    this.isCollapsed = true;
  }
  logoutClick() {
    this.logoutAction.emit();
  }

}
