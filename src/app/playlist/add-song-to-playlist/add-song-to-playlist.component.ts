import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistService } from '../../service/playlist.service';
import { Playlist } from '../../model/playlist';
import { firstValueFrom, Subscription } from 'rxjs';
import { CreatePlaylistComponent } from '../create-playlist/create-playlist.component';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';

@Component({
  selector: 'app-add-song-to-playlist',
  templateUrl: './add-song-to-playlist.component.html',
  styleUrls: ['./add-song-to-playlist.component.scss']
})
export class AddSongToPlaylistComponent implements OnInit {
  @Input() songId: number;
  playlistList: PagingInfo<Playlist> = DataUtil.initPagingInfo();

  constructor(
    private modalService: NgbModal,
    private playlistService: PlaylistService,
    private ngbActiveModal: NgbActiveModal,
    private toastService: VgToastService,
    private loaderService: VgLoaderService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.playlistList = await firstValueFrom(this.playlistService.getPlaylistListToAdd(this.songId));
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }

  addSongToPlaylist(songId: number, playlistId: number): void {
    this.playlistService.addSongToPlaylist(playlistId, [songId]).subscribe(() => {
      this.toastService.success({ title: 'Success', text: 'Song added to playlist' });
      const songToDeleteIndex: number = this.playlistList.content.findIndex(e => e.id === songId);
      this.playlistList.content.splice(songToDeleteIndex, 1);
    });
  }

  openCreatePlaylistDialog(): void {
    const sub: Subscription = this.modalService
      .open(CreatePlaylistComponent, {
        animation: true,
        backdrop: false,
        centered: false,
        scrollable: false,
        size: 'md'
      })
      .closed.subscribe(next => {
        if (next) {
          this.playlistList.content = [...this.playlistList.content, next];
        }
        sub.unsubscribe();
      });
  }

  close(): void {
    this.ngbActiveModal.close();
  }
}
