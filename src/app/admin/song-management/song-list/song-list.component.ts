import { Component, OnInit } from '@angular/core';
import { Song } from '../../../model/song';
import { Subscription } from 'rxjs';
import { SongService } from '../../../service/song.service';
import { ConfirmationModalComponent } from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TOAST_TYPE, VgLoaderService, VgToastService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  songList: Song[];
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

  async getSongList(): Promise<void> {
    try {
      this.loadingService.loading(true);
      this.songList = (await this.songService.getSongList().toPromise()).content;
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
      scrollable: true,
      size: 'md'
    });
    ref.componentInstance.subject = this.translate.instant('common.entity.song');
    ref.componentInstance.name = song.title;
    try {
      const result = await ref.result;
      if (result) {
        this.loadingService.loading(true);
        await this.songService.deleteSong(song?.id).toPromise();
        this.toastService.show({ text: 'Song from playlist removed successfully' }, { type: TOAST_TYPE.SUCCESS });
        await this.getSongList();
      }
    } catch (e) {
      this.toastService.show({ text: 'Failed to delete song. An error has occurred' }, { type: TOAST_TYPE.ERROR });
      console.error(e);
    } finally {
      this.loadingService.loading(false);
    }
  }
}
