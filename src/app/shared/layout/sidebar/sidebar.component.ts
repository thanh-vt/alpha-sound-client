import { Component, OnInit } from '@angular/core';
import { Song } from '../../../model/song';
import { ActivatedRoute } from '@angular/router';
import { SongService } from '../../../service/song.service';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  songList: Song[];

  constructor(private route: ActivatedRoute, private songService: SongService, private loaderService: VgLoaderService) {}

  async ngOnInit(): Promise<void> {
    await this.goToPage();
  }

  addToPlaying(song: Song): void {
    song.isDisabled = true;
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
    });
  }

  async goToPage(): Promise<void> {
    try {
      this.loaderService.loading(true);
      this.songList = (await this.songService.songList({ page: 0, size: 10, sort: ['listening_frequency'] }).toPromise()).content;
    } catch (e) {
      console.error(e);
    } finally {
      this.loaderService.loading(false);
    }
  }
}
