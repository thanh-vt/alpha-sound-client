import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateUtil } from '../../util/date-util';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../service/search.service';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { UserProfileService } from '../../service/user-profile.service';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  loading$: Observable<boolean>;
  esForm: FormGroup = this.fb.group({
    id: [null],
    createTime: [null],
    updateTime: [null]
  });
  minDate: NgbDateStruct = DateUtil.getMinDate();
  indexName = null;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private toastService: VgToastService,
    private userProfileService: UserProfileService,
    private loadingService: VgLoaderService
  ) {
    this.loading$ = this.loadingService.getLoader();
  }

  reloadMapping(): void {
    if (!this.indexName) {
      this.toastService.warning({ text: 'Index must be selected!' });
    }
    this.userProfileService.confirm('Are you sure?', () => {
      this.loadingService.loading(true);
      this.searchService
        .reloadMapping(this.indexName)
        .pipe(
          finalize(() => {
            this.loadingService.loading(false);
          })
        )
        .subscribe(() => {
          this.toastService.success({ text: 'Reload mapping successfully!' });
        });
    });
  }

  markForSync(): void {
    if (!this.indexName) {
      this.toastService.warning({ text: 'Index must be selected!' });
    }
    this.userProfileService.confirm('Are you sure?', () => {
      this.loadingService.loading(true);
      this.searchService
        .markForSync(this.indexName, this.esForm.getRawValue())
        .pipe(
          finalize(() => {
            this.loadingService.loading(false);
          })
        )
        .subscribe(() => {
          this.toastService.success({ text: 'Mark for sync successfully!' });
        });
    });
  }

  clearIndex(): void {
    if (!this.indexName) {
      this.toastService.warning({ text: 'Index must be selected!' });
    }
    this.userProfileService.confirm('Are you sure?', () => {
      this.loadingService.loading(true);
      this.searchService
        .clearIndex(this.indexName)
        .pipe(
          finalize(() => {
            this.loadingService.loading(false);
          })
        )
        .subscribe(() => {
          this.toastService.success({ text: 'Clear index successfully!' });
        });
    });
  }

  resetIndex(): void {
    if (!this.indexName) {
      this.toastService.warning({ text: 'Index must be selected!' });
    }
    this.userProfileService.confirm('Are you sure?', () => {
      this.loadingService.loading(true);
      this.searchService
        .resetIndex(this.indexName)
        .pipe(
          finalize(() => {
            this.loadingService.loading(false);
          })
        )
        .subscribe(() => {
          this.toastService.success({ text: 'Reset index successfully!' });
        });
    });
  }
}
