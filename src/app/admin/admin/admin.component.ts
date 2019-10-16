import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {ModalComponent} from '../../shared/modal/modal.component';
import {UserToken} from '../../model/userToken';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentUser: UserToken;
  hasNotLoggedInAsAdmin = false;
  subscription: Subscription = new Subscription();

  @ViewChild(ModalComponent, {static: false}) loginModal: ModalComponent;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.authService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    if (!this.currentUser) {
      this.hasNotLoggedInAsAdmin = true;
    } else {
      let hasRoleAdmin = false;
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.name === 'ROLE_ADMIN') {
          hasRoleAdmin = true;
          break;
        }
      }
      if (hasRoleAdmin) {
        this.hasNotLoggedInAsAdmin = false;
      } else {
        this.authService.logout();
        this.hasNotLoggedInAsAdmin = true;
        this.router.navigate(['/admin']);
      }
    }
  }

  signOut() {
    this.hasNotLoggedInAsAdmin = true;
    this.authService.logout();
  }

  popLoginFormUp() {
    this.loginModal.open(this.loginModal.content);
  }

}
