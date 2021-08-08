import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { PlaylistService } from '../../service/playlist.service';
import { Playlist } from '../../model/playlist';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.scss']
})
export class EditPlaylistComponent implements OnInit {
  @Input() playlist: Playlist;
  playlistEditForm: FormGroup;
  loading = false;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private playlistService: PlaylistService,
    private toastService: VgToastService
  ) {}

  ngOnInit(): void {
    this.playlistEditForm = this.fb.group({
      title: [this.playlist?.title, Validators.required]
    });
  }

  onSubmit() {
    this.loading = true;
    this.playlistService
      .editPlaylist(this.playlistEditForm.value, this.playlist?.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        () => {
          this.toastService.show({ text: 'Playlist updated successfully' }, { type: TOAST_TYPE.SUCCESS });
          this.ngbActiveModal.close({
            ...this.playlist,
            title: this.playlistEditForm.value.title
          });
        },
        error => {
          this.toastService.show({ text: 'Failed to update playlist' }, { type: TOAST_TYPE.ERROR });
          console.log(error.message);
        }
      );
  }

  close() {
    this.ngbActiveModal.close();
  }
}
