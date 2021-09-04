import { Component, Input, OnInit } from '@angular/core';
import { ArtistService } from '../../../service/artist.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Progress } from '../../../model/progress';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';
import { ArtistUploadData } from '../../../model/avatar-upload-data';
import { Artist } from '../../../model/artist';
import { DateUtil } from '../../../util/date-util';

@Component({
  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.scss']
})
export class ArtistEditComponent implements OnInit {
  @Input() artistId: number;
  artistUploadData: ArtistUploadData = new ArtistUploadData(
    this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      birthDate: [new Date(), [Validators.required]],
      biography: ['', [Validators.required]],
      avatarUrl: [null]
    })
  );
  subscription: Subscription = new Subscription();
  progress: Progress = { value: 0 };
  minDate = DateUtil.getMinDate();

  constructor(
    private artistService: ArtistService,
    private fb: FormBuilder,
    private ngbActiveModal: NgbActiveModal,
    private toastService: VgToastService
  ) {}

  ngOnInit(): void {
    this.artistService.artistDetail(this.artistId).subscribe(next => {
      this.artistUploadData.formGroup.patchValue(next);
    });
  }

  onSubmit(): void {
    if (!this.artistUploadData.isValid()) {
      return;
    }
    const formData: FormData = this.artistUploadData.setup();
    this.artistUploadData.observable = this.artistService.updateArtist(formData, this.artistId);
  }

  onUpdateSuccess(artist: Artist): void {
    this.toastService.show({ text: 'Update artist successfully' }, { type: TOAST_TYPE.SUCCESS });
    setTimeout(() => {
      this.ngbActiveModal.close(artist);
    }, 1000);
  }

  close(): void {
    this.ngbActiveModal.close();
  }
}
