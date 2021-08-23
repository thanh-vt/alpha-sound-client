import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { PlaylistService } from '../../service/playlist.service';
import { VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss']
})
export class CreatePlaylistComponent implements OnInit {
  createPlaylistForm: FormGroup;
  loading = false;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private playlistService: PlaylistService,
    private ngbActiveModal: NgbActiveModal,
    private toastService: VgToastService
  ) {}

  ngOnInit(): void {
    this.createPlaylistForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  onSubmit() {
    this.playlistService.createPlaylist(this.createPlaylistForm.value).subscribe(next => {
      this.toastService.success({ title: 'Success', text: 'Playlist saved successfully' });
      this.ngbActiveModal.close(next);
    });
  }

  close() {
    this.ngbActiveModal.close();
  }
}
