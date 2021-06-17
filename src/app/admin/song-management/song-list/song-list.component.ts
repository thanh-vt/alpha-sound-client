import {Component, OnInit} from '@angular/core';
import {Song} from '../../../model/song';
import {Subscription} from 'rxjs';
import {SongService} from '../../../service/song.service';
import {ConfirmationModalComponent} from '../../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {LoadingService} from '../../../shared/service/loading.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  songList: Song[];
  subscription: Subscription = new Subscription();
  message: string;

  constructor(private songService: SongService, private ngbModal: NgbModal,
              private translate: TranslateService, private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.getSongList().finally();
  }

  async getSongList(): Promise<void> {
    try {
      this.loadingService.show();
      this.songList = (await this.songService.getSongList().toPromise()).content;
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingService.hide();
    }

  }

  async openDeleteDialog(song: Song, event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.ngbModal.open(ConfirmationModalComponent, {
        animation: true,
        backdrop: 'static',
        centered: true,
        scrollable: true,
        size: 'md',
      }
    );
    ref.componentInstance.subject = this.translate.instant('common.entity.artist');
    ref.componentInstance.name = song.title;
    try {
      const result = await ref.result;
      if (result) {
        this.loadingService.show();
        await this.songService.deleteSong(song?.id).toPromise();
        await this.getSongList();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingService.hide();
    }
  }
}
