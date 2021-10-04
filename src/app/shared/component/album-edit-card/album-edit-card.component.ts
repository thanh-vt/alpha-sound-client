import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AlbumUploadData } from '../../../model/album-upload-data';
import { DateUtil } from '../../../util/date-util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlbumEditAdditionalInfoComponent } from '../album-edit-additional-info/album-edit-additional-info.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SongUploadData } from '../../../model/song-upload-data';
import { Album } from '../../../model/album';

@Component({
  selector: 'app-album-edit-card',
  templateUrl: './album-edit-card.component.html',
  styleUrls: ['./album-edit-card.component.scss']
})
export class AlbumEditCardComponent implements OnChanges {
  @Input() albumUploadData!: AlbumUploadData;
  @Input() album: Album;
  @Output() submitEvent: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  albumForm: FormGroup = this.fb.group({
    id: [null],
    title: ['', Validators.compose([Validators.required])],
    artists: this.fb.array([this.fb.control(null, Validators.required)]),
    releaseDate: ['', Validators.compose([Validators.required])],
    genres: [null],
    tags: [null],
    country: [null],
    theme: [null],
    coverUrl: [null],
    additionalInfo: [null]
  });
  artistFormArr: FormArray = this.albumForm.get('artists') as FormArray;
  minDate = DateUtil.getMinDate();
  additionalRef: NgbModalRef;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.album && this.album) {
      this.albumForm.patchValue(this.albumUploadData.album);
      const albumArtistFormArr = this.albumForm.get('artists') as FormArray;
      albumArtistFormArr.clear();
      this.albumUploadData.album.artists.forEach(artist => {
        const artistForm = SongUploadData.createArtist(this.fb);
        artistForm.setValue(artist);
        albumArtistFormArr.push(artistForm);
      });
    }
  }

  onSubmit(): void {
    if (this.albumForm.invalid) {
      return;
    }
    if (!this.albumUploadData.album && !this.albumUploadData.formData.get('cover')) {
      return;
    }
    this.albumUploadData.formData.set('album', new Blob([JSON.stringify(this.albumForm.getRawValue())], { type: 'application/json' }));
    this.submitEvent.emit(this.albumForm);
  }

  openAdditionalForm(): void {
    this.additionalRef = this.modalService.open(AlbumEditAdditionalInfoComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'lg'
    });
    this.additionalRef.componentInstance.albumId = this.albumForm.get('id').value;
    this.additionalRef.componentInstance.additionalInfo = this.albumForm.get('additionalInfo').value;
    const sub = this.additionalRef.closed.subscribe(next => {
      if (next) {
        this.albumForm.get('additionalInfo').setValue(next);
      }
      sub.unsubscribe();
    });
  }
}
