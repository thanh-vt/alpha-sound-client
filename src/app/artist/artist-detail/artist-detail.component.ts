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
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  currentUser: User;
  artist: Artist;
  artistId: number;
  message: string;
  first: boolean;
  last: boolean;
  pageNumber = 0;
  pageSize: number;
  isDisable: boolean;
  pages: Page[] = [];
  songList: Song[];
  playlistList: Playlist[];
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private artistService: ArtistService,
              private songService: SongService, private playlistService: PlaylistService,
              private playingQueueService: PlayingQueueService, private userService: UserService) {
    this.userService.currentUser.subscribe(
      currentUser => {
        this.currentUser = currentUser;
      }
    );
  }

  ngOnInit() {
    this.subscription.add(this.route.queryParams.subscribe(
      params => {
        this.artistId = params.id;
        this.subscription.add(this.artistService.artistDetail(this.artistId).subscribe(
          result => {
            window.scroll(0, 0);
            this.artist = result;
          }
        ));
        this.artistService.getSongListOfArtist(this.artistId, this.pageNumber).subscribe(
          result1 => {
            if (result1 != null) {
              this.songList.push(result1.content);
            }
          }, error => {
            this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
          }
        );
      }
    ));
  }

  onScroll(pageNumber) {
    this.subscription.add(this.artistService.getSongListOfArtist(this.artistId, pageNumber).subscribe(
      result => {
        if (result != null) {
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
    this.playingQueueService.addToQueue({
      title: song.title,
      link: song.url
    });
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

  refreshSongList(pageNumber: number) {
    this.artistService.getSongListOfArtist(this.artistId, this.pageNumber).subscribe(
      result => {
        for (let i = 0; i < this.pageSize; i++) {
          this.songList[this.pageSize * this.pageNumber + i] = result.content[i];
        }
      }
    );
  }

  likeSong(songId: number) {
    this.subscription.add(this.songService.likeSong(songId).subscribe(
      () => {
        this.subscription.add(this.refreshSongList(this.pageNumber));
      }, error => {
        console.log(error);
      }
    ));
  }

  unlikeSong(songId: number) {
    this.songService.unlikeSong(songId).subscribe(
      () => {
        this.subscription.add(this.refreshSongList(this.pageNumber));
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
