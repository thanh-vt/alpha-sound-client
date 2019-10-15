import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {ModalComponent} from '../../shared/modal/modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @Output() logoutAction = new EventEmitter();
  isLoggedInAsAdmin = false;
  subscription: Subscription = new Subscription();

  @ViewChild(ModalComponent, {static: false}) loginModal: ModalComponent;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.isLoggedInAsAdmin = true;
    } else {
      let hasRoleAdmin = false;
      const roleList = JSON.parse(localStorage.getItem('userToken')).roles;
      for (const role of roleList) {
        if (role.name === 'ROLE_ADMIN') {
          hasRoleAdmin = true;
          break;
        }
      }
      if (hasRoleAdmin) {
        this.isLoggedInAsAdmin = false;
      } else {
        this.authService.logout();
        this.isLoggedInAsAdmin = true;
        this.router.navigate(['/admin']);
      }
    }
  }

  signOut() {
    this.isLoggedInAsAdmin = true;
    this.authService.logout();
    this.logoutAction.emit();
  }

  popLoginFormUp() {
    this.loginModal.open(this.loginModal.content);
  }

}
