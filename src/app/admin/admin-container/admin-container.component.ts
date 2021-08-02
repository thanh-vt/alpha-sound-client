import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ModalComponent } from '../../shared/component/modal/modal.component';
import { TranslateService } from '@ngx-translate/core';
import { UserProfile } from '../../model/token-response';
import { AuthUtil } from '../../util/auth.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminLoginComponent } from '../admin-login/admin-login.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss']
})
export class AdminContainerComponent implements OnInit {
  currentUser: UserProfile;
  hasNotLoggedInAsAdmin = false;
  subscription: Subscription = new Subscription();

  @ViewChild(ModalComponent) loginModal: ModalComponent;
  active: 'top';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngbModal: NgbModal,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    const currentLanguage = this.translate.getBrowserLang();
    translate.setDefaultLang(currentLanguage);
    translate.use(currentLanguage);
    this.subscription.add(
      this.authService.currentUser$.subscribe(next => {
        this.currentUser = next;
      })
    );
  }

  ngOnInit() {
    if (!this.currentUser) {
      this.hasNotLoggedInAsAdmin = true;
    } else {
      const hasRoleAdmin = AuthUtil.isAdmin(this.currentUser);
      this.hasNotLoggedInAsAdmin = !hasRoleAdmin;
    }
    // if (this.hasNotLoggedInAsAdmin) {
    //   this.signOut();
    //   this.router.navigate(['/admin']);
    // }
  }

  signOut() {
    this.hasNotLoggedInAsAdmin = true;
    this.authService.logout();
  }

  popLoginFormUp(event) {
    const ref = this.ngbModal.open(AdminLoginComponent, {
      animation: true,
      backdrop: 'static',
      centered: true,
      scrollable: true,
      size: 'md'
    });
    // this.loginModal.open(this.loginModal.content, event);
  }
}
