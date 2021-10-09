import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { UserProfile } from '../model/token-response';
import { RegistrationConfirm } from '../model/registration-confirm';
import { ChangePassword } from '../model/change-password';
import { UserInfo } from '../model/user-info';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private http: HttpClient, private translate: TranslateService, private modalService: NgbModal) {}

  getCurrentUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${environment.apiUrl}/info`);
  }

  getCurrentUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/profile`);
  }

  getUserDetail(username: string): Observable<UserInfo> {
    const params = { username };
    return this.http.get<UserInfo>(`${environment.apiUrl}/user`, { params });
  }

  register(formGroup: UserProfile): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/register`, formGroup);
  }

  confirmRegistration(registrationConfirm: RegistrationConfirm): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/registration-confirm`, registrationConfirm);
  }

  updateProfile(formData: FormData): Observable<HttpEvent<UserProfile>> {
    return this.http.patch<UserProfile>(`${environment.apiUrl}/profile`, formData, { observe: 'response' });
  }

  getPasswordResetToken(formGroup: UserProfile): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/reset-password`, formGroup);
  }

  resetPasswordSubmission(changePassword: ChangePassword): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/reset-password`, changePassword);
  }

  confirm(message = 'Are you sure?', callback: () => void): void {
    const dialogRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const comp: ConfirmationModalComponent = dialogRef.componentInstance;
    comp.subject = this.translate.instant(message);
    comp.name = '';
    comp.data = true;
    comp.confirmDelete = false;
    const sub: Subscription = dialogRef.closed.subscribe(result => {
      sub.unsubscribe();
      if (result) {
        callback();
      }
    });
  }
}
