import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SongUploadData } from '../../../model/song-upload-data';
import { DateUtil } from '../../../util/date-util';
import { Song } from '../../../model/song';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SongEditAdditionalInfoComponent } from '../song-edit-additional-info/song-edit-additional-info.component';

@Component({
  selector: 'app-song-edit-card',
  templateUrl: './song-edit-card.component.html',
  styleUrls: ['./song-edit-card.component.scss']
})
export class SongEditCardComponent implements OnInit {
  @Input() songId: number;
  @Input() isSubmittable!: boolean;
  @Input() songUploadData!: SongUploadData;
  @Output() submitEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() uploadSuccessEvent: EventEmitter<Song> = new EventEmitter<Song>();
  minDate = DateUtil.getMinDate();
  additionalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    if (this.songUploadData?.type === 'view') {
      this.songUploadData?.formGroup?.disable();
    }
  }

  onSubmit(): void {
    if (this.isSubmittable) {
      this.submitEvent.emit();
    }
  }

  onUploadSuccess(event: Song): void {
    if (this.isSubmittable) {
      this.uploadSuccessEvent.emit(event);
    }
  }

  setMetadata(event: Event, formGroup: FormGroup): void {
    const target = event.target as HTMLAudioElement;
    formGroup.get('duration').setValue(target.duration);
  }

  openAdditionalForm(): void {
    this.additionalRef = this.modalService.open(SongEditAdditionalInfoComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'lg'
    });
    const songId = this.songUploadData.formGroup.get('id').value;
    console.log(songId);
    this.additionalRef.componentInstance.songId = songId;
    const sub = this.additionalRef.closed.subscribe(next => {
      if (next) {
        this.songUploadData.formGroup.get('additionalInfo').setValue(next);
      }
      sub.unsubscribe();
    });
  }
}
