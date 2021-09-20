import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlbumUploadData } from '../../../model/album-upload-data';
import { DateUtil } from '../../../util/date-util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlbumEditAdditionalInfoComponent } from '../album-edit-additional-info/album-edit-additional-info.component';

@Component({
  selector: 'app-album-edit-card',
  templateUrl: './album-edit-card.component.html',
  styleUrls: ['./album-edit-card.component.scss']
})
export class AlbumEditCardComponent {
  @Input() albumUploadData!: AlbumUploadData;
  @Output() submitEvent: EventEmitter<void> = new EventEmitter<void>();
  minDate = DateUtil.getMinDate();
  additionalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  onSubmit(): void {
    this.submitEvent.emit();
  }

  openAdditionalForm(): void {
    this.additionalRef = this.modalService.open(AlbumEditAdditionalInfoComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'lg'
    });
    this.additionalRef.componentInstance.albumId = this.albumUploadData.formGroup.get('id').value;
    this.additionalRef.componentInstance.additionalInfo = this.albumUploadData.formGroup.get('additionalInfo').value;
    const sub = this.additionalRef.closed.subscribe(next => {
      if (next) {
        this.albumUploadData.formGroup.get('additionalInfo').setValue(next);
      }
      sub.unsubscribe();
    });
  }
}
