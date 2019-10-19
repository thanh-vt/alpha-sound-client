import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {Artist} from '../../model/artist';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {ArtistService} from '../../service/artist.service';
import {SongService} from '../../service/song.service';
import {Subscription} from 'rxjs';
import {Song} from '../../model/song';
import {Page} from '../../model/page';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {PlaylistService} from '../../service/playlist.service';
import {Playlist} from '../../model/playlist';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  artist: Artist;
  artistId: number;
  message: string;
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  isDisable: boolean;
  pages: Page[] = [];
  songList: Song[];
  playlistList: Playlist[];
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
              // tslint:disable-next-line:max-line-length
              private artistService: ArtistService, private songService: SongService, private playlistService: PlaylistService, private playingQueueService: PlayingQueueService) { }

  ngOnInit() {
    this.subscription.add(this.route.queryParams.subscribe(
      params => {
        this.artistId = params.id;
        this.subscription.add(this.artistService.artistDetail(this.artistId).subscribe(
          result => {
            window.scroll(0, 0);
            this.artist = result;
            this.artistService.getSongList(this.artistId).subscribe(
              result1 => {
                if (result1 != null) {
                  this.songList = result1.content;

                }
              }, error => {
                this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
              }
            );
          }
        ));
      }
    ));
  }

  goToPage(i: number, scrollUp?: boolean) {
    this.subscription.add(this.songService.getSongList(i, undefined).subscribe(
      result => {
        if (result != null) {
          if (scrollUp) {window.scroll(0, 0); }
          this.songList = result.content;
          this.songList.forEach((value, index) => {
            this.songList[index].isDisabled = false;
          });
          this.first = result.first;
          this.last = result.last;
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
    ));
  }

  addToPlaying(song: Song) {
    this.subscription.add(this.songService.listenToSong(song.id).subscribe(
      () => {
        this.playingQueueService.addToQueue({
          title: song.title,
          link: song.url
        });
      }
    ));
  }

  refreshPlaylistList(songId: number) {
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
