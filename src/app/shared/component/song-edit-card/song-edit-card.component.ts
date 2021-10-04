import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SongUploadData } from '../../../model/song-upload-data';
import { DateUtil } from '../../../util/date-util';
import { Song } from '../../../model/song';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SongEditAdditionalInfoComponent } from '../song-edit-additional-info/song-edit-additional-info.component';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-song-edit-card',
  templateUrl: './song-edit-card.component.html',
  styleUrls: ['./song-edit-card.component.scss']
})
export class SongEditCardComponent implements OnInit, OnChanges {
  @Input() song: Song;
  @Input() songUploadData!: SongUploadData;
  @Output() submitEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() uploadSuccessEvent: EventEmitter<Song> = new EventEmitter<Song>();
  songForm = this.fb.group({
    id: [null],
    title: ['', Validators.compose([Validators.required])],
    artists: this.fb.array([this.fb.control(null, Validators.compose([Validators.required]))]),
    releaseDate: ['', Validators.compose([Validators.required])],
    duration: [null],
    url: [null],
    uploader: [null],
    additionalInfo: [null]
  });
  artistFormArr: FormArray = this.songForm.get('artists') as FormArray;
  minDate = DateUtil.getMinDate();
  additionalRef: NgbModalRef;

  constructor(private fb: FormBuilder, private authService: AuthService, private modalService: NgbModal) {}

  ngOnInit(): void {
    if (this.songUploadData?.type === 'VIEW') {
      this.songForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.song && this.song) {
      this.songForm.patchValue(this.songUploadData.song);
      const artistFormArr = this.songForm.get('artists') as FormArray;
      this.song.artists.forEach(artist => {
        const artistForm = SongUploadData.createArtist(this.fb);
        artistForm.setValue(artist);
        artistFormArr.push(artistForm);
      });
    }
  }

  onSubmit(): void {
    if (this.songForm.invalid) {
      return;
    }
    if (!this.songUploadData?.song && !this.songUploadData.formData.get('audio')) {
      return;
    }
    this.songUploadData.formData.set('song', new Blob([JSON.stringify(this.songForm.getRawValue())], { type: 'application/json' }));
    this.submitEvent.emit();
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
    this.additionalRef.componentInstance.songId = this.songUploadData.song?.id;
    this.additionalRef.componentInstance.additionalInfo = this.songForm.get('additionalInfo').value;
    const sub = this.additionalRef.closed.subscribe(next => {
      if (next) {
        this.songForm.get('additionalInfo').setValue(next);
      }
      sub.unsubscribe();
    });
  }
}
