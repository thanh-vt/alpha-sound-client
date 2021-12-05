import { Component, OnInit } from '@angular/core';
import { Song } from '../../../model/song';
import { firstValueFrom, Subscription } from 'rxjs';
import { SongService } from '../../../service/song.service';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { VgLoaderService, VgToastService } from 'ngx-vengeance-lib';
import { PagingInfo } from '../../../model/paging-info';
import { DataUtil } from '../../../util/data-util';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  songPage: PagingInfo<Song> = DataUtil.initPagingInfo();
  subscription: Subscription = new Subscription();
  message: string;

  constructor(
    private songService: SongService,
    private ngbModal: NgbModal,
    private translate: TranslateService,
    private loadingService: VgLoaderService,
    private toastService: VgToastService
  ) {}

  ngOnInit(): void {
    this.getSongList().finally();
  }

  async getSongList(page = 0): Promise<void> {
    try {
      this.loadingService.loading(true);
      this.songPage = await firstValueFrom(this.songService.songList({ page }));
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingService.loading(false);
    }
  }

  async openDeleteDialog(song: Song, event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.song');
    ref.componentInstance.name = song.title;
    try {
      const result = await ref.result;
      if (result) {
        this.loadingService.loading(true);
        await firstValueFrom(this.songService.deleteSong(song?.id));
        this.toastService.success({ text: 'Song from playlist removed successfully' });
        await this.getSongList();
      }
    } catch (e) {
      this.toastService.error({ text: 'Failed to delete song. An error has occurred' });
      console.error(e);
    } finally {
      this.loadingService.loading(false);
    }
  }
}
