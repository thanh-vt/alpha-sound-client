import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { PlaylistService } from '../../service/playlist.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.scss']
})
export class EditPlaylistComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() playlistName: string;
  playlistEditForm: FormGroup;
  loading = false;
  error = false;
  message: string;
  @Output() editPlaylist = new EventEmitter();
  subscription: Subscription = new Subscription();
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    this.playlistEditForm = this.fb.group({
      title: [this.playlistName, Validators.required]
    });
  }

  onSubmit() {
    this.subscription.add(
      this.playlistService.editPlaylist(this.playlistEditForm.value, this.id).subscribe(
        () => {
          this.error = false;
          this.message = 'Playlist updated successfully.';
        },
        error => {
          this.error = true;
          this.message = 'Failed to update playlist.';
          console.log(error.message);
        }
      )
    );
  }

  editAction() {
    this.message = '';
    this.editPlaylist.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
