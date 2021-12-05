import { Component, OnDestroy, OnInit } from '@angular/core';
import { Playlist } from '../../model/playlist';
import { PlaylistService } from '../../service/playlist.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EditPlaylistComponent } from '../edit-playlist/edit-playlist.component';
import { CreatePlaylistComponent } from '../create-playlist/create-playlist.component';
import { ConfirmationModalComponent } from '../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { TOAST_TYPE, VgLoaderService, VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.scss']
})
export class PlaylistListComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  playlistList: Playlist[] = [];

  constructor(
    private playlistService: PlaylistService,
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastService: VgToastService,
    private loaderService: VgLoaderService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.refreshPlaylistList();
  }

  async refreshPlaylistList(): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.playlistList = (await firstValueFrom(this.playlistService.getPlaylistList())).content;
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  openCreateDialog(event: MouseEvent): void {
    event.stopPropagation();
    const modalRef: NgbModalRef = this.modalService.open(CreatePlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const sub: Subscription = modalRef.closed.subscribe((result: Playlist) => {
      if (result) {
        this.playlistList.push(result);
      }
      sub.unsubscribe();
    });
  }

  openEditDialog(playlist: Playlist, event: MouseEvent): void {
    event.stopPropagation();
    const modalRef: NgbModalRef = this.modalService.open(EditPlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
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

  openDeleteDialog(playlist: Playlist, event: MouseEvent): void {
    event.stopPropagation();
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const comp: ConfirmationModalComponent = modalRef.componentInstance;
    comp.subject = this.translate.instant('common.entity.playlist');
    comp.name = playlist?.title;
    comp.data = playlist;
    this.subscription = modalRef.closed.subscribe(async (result: Playlist) => {
      if (result) {
        try {
          this.loaderService.loading(true);
          await firstValueFrom(this.playlistService.deletePlaylist(result?.id));
          this.toastService.show({ text: 'Playlist removed successfully' }, { type: TOAST_TYPE.SUCCESS });
          const index = this.playlistList.indexOf(playlist);
          this.playlistList.splice(index, 1);
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderService.loading(false);
        }
      }
      this.subscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
