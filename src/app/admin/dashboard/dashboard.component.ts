import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateUtil } from '../../util/date-util';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../service/search.service';
import { VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  esForm: FormGroup = this.fb.group({
    id: [null],
    createTime: [null],
    updateTime: [null]
  });
  minDate: NgbDateStruct = DateUtil.getMinDate();
  indexName = 'song';

  constructor(private fb: FormBuilder, private searchService: SearchService, private toastService: VgToastService) {}

  reloadMapping(): void {
    if (!this.indexName) {
      this.toastService.warning({ text: 'Index must be selected!' });
    }
    this.searchService.reloadMapping(this.indexName).subscribe(() => {
      this.toastService.success({ text: 'Reload mapping successfully!' });
    });
  }

  markForSync(): void {
    if (!this.indexName) {
      this.toastService.warning({ text: 'Index must be selected!' });
    }
    this.searchService.markForSync(this.indexName, this.esForm.getRawValue()).subscribe(() => {
      this.toastService.success({ text: 'Mark for sync successfully!' });
    });
  }

  clearIndex(): void {
    if (!this.indexName) {
      this.toastService.warning({ text: 'Index must be selected!' });
    }
    this.searchService.clearIndex(this.indexName).subscribe(() => {
      this.toastService.success({ text: 'Clear index successfully!' });
    });
  }
}
