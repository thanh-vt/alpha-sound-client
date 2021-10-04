import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SongUploadData } from '../../../model/song-upload-data';
import { Song } from '../../../model/song';
import { DateUtil } from '../../../util/date-util';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { SongEditAdditionalInfoComponent } from '../song-edit-additional-info/song-edit-additional-info.component';

@Component({
  selector: 'app-song-edit-modal',
  templateUrl: './song-edit-modal.component.html',
  styleUrls: ['./song-edit-modal.component.scss']
})
export class SongEditModalComponent implements OnInit {
  @Input() song: Song;
  @Input() songUploadData!: SongUploadData;
  @Output() uploadSuccessEvent: EventEmitter<Song> = new EventEmitter<Song>();
  songForm: FormGroup = this.fb.group({
    id: [null],
    title: ['', Validators.compose([Validators.required])],
    artists: this.fb.array([]),
    releaseDate: ['', Validators.compose([Validators.required])],
    duration: [null],
    url: [null],
    uploader: [null],
    additionalInfo: [null]
  });
  artistFormArr: FormArray = this.songForm.get('artists') as FormArray;
  minDate = DateUtil.getMinDate();
  additionalRef: NgbModalRef;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.song) {
      this.songForm.patchValue(this.song);
      const artistFormArr = this.songForm.get('artists') as FormArray;
      this.song.artists.forEach(artist => {
        const artistForm = SongUploadData.createArtist(this.fb);
        artistForm.setValue(artist);
        artistFormArr.push(artistForm);
      });
    } else {
      const artistFormArr = this.songForm.get('artists') as FormArray;
      artistFormArr.clear();
      artistFormArr.push(SongUploadData.createArtist(this.fb));
    }
    if (this.songUploadData?.type === 'VIEW') {
      this.songForm.disable();
    }
  }

  onSubmit(): void {
    if (this.songForm.invalid) {
      return;
    }
    if (!this.song && !this.songUploadData.formData.get('audio')) {
      return;
    }
    const songFromVal = this.songForm.getRawValue();
    this.songUploadData.formData.set('song', new Blob([JSON.stringify(songFromVal)], { type: 'application/json' }));
    this.activeModal.close(songFromVal);
  }

  onUploadSuccess(event: Song): void {
    this.uploadSuccessEvent.emit(event);
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
    console.log(this.songForm.get('additionalInfo').value);
    this.additionalRef.componentInstance.songId = this.song?.id;
    this.additionalRef.componentInstance.additionalInfo = this.songForm.get('additionalInfo').value;
    const sub = this.additionalRef.closed.subscribe(next => {
      if (next) {
        this.songForm.get('additionalInfo').setValue(next);
      }
      sub.unsubscribe();
    });
  }

  close(): void {
    this.activeModal.close();
  }
}
