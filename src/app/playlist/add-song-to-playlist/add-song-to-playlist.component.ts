import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistService } from '../../service/playlist.service';
import { Playlist } from '../../model/playlist';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CreatePlaylistComponent } from '../create-playlist/create-playlist.component';
import { ToastService } from '../../shared/service/toast.service';

@Component({
  selector: 'app-add-song-to-playlist',
  templateUrl: './add-song-to-playlist.component.html',
  styleUrls: ['./add-song-to-playlist.component.scss']
})
export class AddSongToPlaylistComponent implements OnInit, OnDestroy {
  @Input() songId: number;
  playlistList: Playlist[] = [];
  loading: boolean;
  subscription: Subscription = new Subscription();

  constructor(
    private modalService: NgbModal,
    private playlistService: PlaylistService,
    private ngbActiveModal: NgbActiveModal,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.playlistService
      .getPlaylistListToAdd(this.songId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        result => {
          this.playlistList = result;
        },
        error => {
          console.log(error.message);
          this.toastService.error('Error', 'An error has occurred.');
        }
      );
  }

  addSongToPlaylist(songId: number, playlistId: number) {
    this.subscription.add(
      this.playlistService.addSongToPlaylist(songId, playlistId).subscribe(
        _ => {
          this.toastService.success('Success', 'Song added to playlist');
          const songToDeleteIndex: number = this.playlistList.findIndex(e => e.id === songId);
          this.playlistList.splice(songToDeleteIndex, 1);
        },
        error => {
          this.toastService.error('Error', 'Cannot add song to playlist. Cause: ' + error.message);
        }
      )
    );
  }

  openCreatePlaylistDialog() {
    const sub: Subscription = this.modalService
      .open(CreatePlaylistComponent, {
        animation: true,
        backdrop: false,
        centered: false,
        scrollable: true,
        size: 'md'
      })
      .closed.subscribe(next => {
        if (next) {
          this.playlistList = [...this.playlistList, next];
        }
        sub.unsubscribe();
      });
  }

  close() {
    this.ngbActiveModal.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
