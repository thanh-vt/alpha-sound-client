import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserProfileService } from '../../service/user-profile.service';
import { UserProfile } from '../../model/token-response';
import { VgLoaderService } from 'ngx-vengeance-lib';
import { UserInfo } from '../../model/user-info';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser$: Observable<UserProfile>;
  showEditForm = false;
  username: string;
  user: UserInfo;
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserProfileService,
    private loaderService: VgLoaderService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.subscribe(async next => {
        try {
          this.loaderService.loading(true);
          this.username = next.get('id');
          if (!this.username) {
            this.user = await this.userService.getCurrentUserInfo().toPromise();
          } else {
            this.user = await this.userService.getUserDetail(this.username).toPromise();
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderService.loading(false);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onUpdate(event: UserProfile): void {
    this.showEditForm = false;
    this.user.profile = event;
  }
}
