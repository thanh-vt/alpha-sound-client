import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Song} from '../../model/song';
import {SongService} from '../../service/song.service';
import {Page} from '../../model/page';
import {AddSongToPlaying} from '../../service/add-song-to-playling.service';
import {ActivatedRoute} from '@angular/router';
import {PlaylistService} from '../../service/playlist.service';
import {Playlist} from '../../model/playlist';
import {Subscription} from 'rxjs';
import {UserComponent} from '../../user/user/user.component';
@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.component.html',
  styleUrls: ['./new-song.component.scss']
})
export class NewSongComponent implements OnInit, OnDestroy {
  private pageNumber: number;
  private pageSize: number;
  private pages: Page[] = [];
  private message;
  private songList: Song[];
  private isDisable: boolean;
  private subscription: Subscription = new Subscription();
  playlistList: Playlist[];
  @ViewChild(UserComponent, {static: false}) userComponent: UserComponent;

  constructor(private songService: SongService, private addSongToPlaying: AddSongToPlaying, private playlistService: PlaylistService) { }

  ngOnInit() {
    this.goToPage(undefined);
  }

  addToPlaying(song) {
    this.subscription.add(this.songService.listenToSong(song.id).subscribe(
      () => {
        this.goToPage(this.pageNumber);
      }
    ));
    this.addSongToPlaying.emitChange(song);
  }

  goToPage(i) {
    this.songService.getSongList(i, 'releaseDate').subscribe(
      result => {
        if (result != null) {
          window.scroll(0, 0);
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
          this.pageNumber = result.pageable.pageNumber;
          this.pageSize = result.pageable.pageSize;
          this.pages = new Array(result.totalPages);
          for (let j = 0; j < this.pages.length; j++) {
            this.pages[j] = {pageNumber: j};
          }
        }
      }, error => {
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }
    );
  }

  refreshPlaylistList(songId) {
    this.subscription.add(this.playlistService.getPlaylistListToAdd(songId).subscribe(
      result => {
        this.playlistList = result;
      }, error => {
        console.log(error);
      }
    ));
  }

  likeSong(songId: number) {
    this.subscription.add(this.songService.likeSong(songId).subscribe(
      () => {
        this.subscription.add(this.goToPage(this.pageNumber));
      }, error => {
        console.log(error);
      }
    ));
  }

  unlikeSong(songId: number) {
    this.songService.unlikeSong(songId).subscribe(
      () => {
        this.subscription.add(this.goToPage(this.pageNumber));
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
