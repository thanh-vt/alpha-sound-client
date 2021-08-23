import { Component, OnDestroy, OnInit } from '@angular/core';
import { Playlist } from '../../model/playlist';
import { PlaylistService } from '../../service/playlist.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditPlaylistComponent } from '../edit-playlist/edit-playlist.component';
import { CreatePlaylistComponent } from '../create-playlist/create-playlist.component';
import { ConfirmationModalComponent } from '../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { TOAST_TYPE, VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit, OnDestroy {
  loading = false;
  subscription: Subscription = new Subscription();
  playlistList: Playlist[] = [];

  constructor(
    private playlistService: PlaylistService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastService: VgToastService
  ) {}

  ngOnInit() {
    this.refreshPlaylistList();
  }

  refreshPlaylistList() {
    this.loading = true;
    this.subscription.add(
      this.playlistService
        .getPlaylistList()
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(result => {
          if (result != null) {
            this.playlistList = result.content;
            this.playlistList.forEach((value, index) => {
              this.playlistList[index].isDisabled = false;
            });
          } else {
            this.playlistList = null;
          }
        })
    );
  }

  openCreateDialog($event: MouseEvent) {
    const modalRef: NgbModalRef = this.modalService.open(CreatePlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    const sub: Subscription = modalRef.closed.subscribe((result: Playlist) => {
      if (result) {
        this.playlistList.push(result);
      }
      sub.unsubscribe();
    });
  }

  openEditDialog(playlist: Playlist, $event: MouseEvent) {
    const modalRef: NgbModalRef = this.modalService.open(EditPlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    const comp: EditPlaylistComponent = modalRef.componentInstance;
    comp.playlist = playlist;
    const sub: Subscription = modalRef.closed.subscribe((result: Playlist) => {
      if (result) {
        const index = this.playlistList.indexOf(playlist);
        this.playlistList.splice(index, 1, result);
      }
      sub.unsubscribe();
    });
  }

  openDeleteDialog(playlist: Playlist, $event: MouseEvent) {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: true,
      size: 'md'
    });
    const comp: ConfirmationModalComponent = modalRef.componentInstance;
    comp.subject = this.translate.instant('Do you want to delete playlist');
    comp.name = playlist?.title;
    comp.data = playlist;
    const sub: Subscription = modalRef.closed.subscribe((result: Playlist) => {
      if (result) {
        this.loading = true;
        this.playlistService
          .deletePlaylist(result?.id)
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe(() => {
            this.toastService.show({ text: 'Playlist removed successfully' }, { type: TOAST_TYPE.SUCCESS });
            const index = this.playlistList.indexOf(playlist);
            this.playlistList.splice(index, 1);
          });
      }
      sub.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
