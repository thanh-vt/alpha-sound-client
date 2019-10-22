import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {ModalComponent} from '../../shared/modal/modal.component';
import {UserToken} from '../../model/userToken';
import {User} from '../../model/user';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentUser: User;
  hasNotLoggedInAsAdmin = false;
  subscription: Subscription = new Subscription();

  @ViewChild(ModalComponent, {static: false}) loginModal: ModalComponent;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private userService: UserService) {
    this.userService.currentUser.subscribe(
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
      this.hasNotLoggedInAsAdmin = !hasRoleAdmin;
    }
    if (this.hasNotLoggedInAsAdmin) {
      this.signOut();
      this.router.navigate(['/admin']);
    }
  }

  signOut() {
    this.hasNotLoggedInAsAdmin = true;
    this.authService.logout();
  }

  popLoginFormUp(event) {
    this.loginModal.open(this.loginModal.content, event);
  }

}
