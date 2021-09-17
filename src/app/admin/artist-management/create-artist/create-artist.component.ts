import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../../service/artist.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';
import { ArtistUploadData } from '../../../model/avatar-upload-data';
import { Artist } from '../../../model/artist';
import { DateUtil } from '../../../util/date-util';

@Component({
  selector: 'app-create-artist',
  templateUrl: './create-artist.component.html',
  styleUrls: ['./create-artist.component.scss']
})
export class CreateArtistComponent implements OnInit {
  artistUploadData!: ArtistUploadData;
  minDate = DateUtil.getMinDate();
  loading = false;

  constructor(
    private artistService: ArtistService,
    private fb: FormBuilder,
    private ngbActiveModal: NgbActiveModal,
    private toastService: VgToastService
  ) {}

  ngOnInit(): void {
    this.artistUploadData = new ArtistUploadData(
      this.fb.group({
        name: ['', [Validators.required, Validators.min(4)]],
        birthDate: [new Date(), [Validators.required]],
        biography: ['', [Validators.required]],
        avatarUrl: [null]
      })
    );
  }

  onSubmit(): void {
    if (!this.artistUploadData.isValid(true)) {
      if (!this.artistUploadData.formData.get('avatar')) {
        this.toastService.warning({ text: 'Artist avatar must be chosen' });
      }
      return;
    }
    const formData = this.artistUploadData.setup();
    this.artistUploadData.observable = this.artistService.createArtist(formData);
  }

  onUpdateSuccess(artist: Artist): void {
    this.toastService.show({ text: 'Create artist successfully' }, { type: TOAST_TYPE.SUCCESS });
    setTimeout(() => {
      this.ngbActiveModal.close(artist);
    }, 1000);
  }

  close(): void {
    this.ngbActiveModal.close();
  }
}
