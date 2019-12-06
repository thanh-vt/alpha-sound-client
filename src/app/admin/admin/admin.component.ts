import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ModalComponent} from '../../shared/modal/modal.component';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {UserToken} from '../../models/userToken';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentUserToken: UserToken;
  hasNotLoggedInAsAdmin = false;
  subscription: Subscription = new Subscription();

  @ViewChild(ModalComponent, {static: false}) loginModal: ModalComponent;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, public translate: TranslateService) {
    const currentLanguage = this.translate.getBrowserLang();
    translate.setDefaultLang(currentLanguage);
    translate.use(currentLanguage);
    this.subscription.add(this.authService.currentUserToken.subscribe(
      next => {
        this.currentUserToken = next;
      }
    ));
  }

  ngOnInit() {
    if (!this.currentUserToken) {
      this.hasNotLoggedInAsAdmin = true;
    } else {
      let hasRoleAdmin = false;
      const roleList = this.currentUserToken.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_ADMIN') {
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
