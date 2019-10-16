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
import {AddSongToPlaying} from '../../service/add-song-to-playling.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
  private artist: Artist;
  private artistId;
  private message;
  private pageNumber: number;
  private pageSize: number;
  private pages: Page[] = [];
  private songList: Song[];
  private isDisable: boolean;
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private artistService: ArtistService, private songService: SongService, private addSongToPlaying: AddSongToPlaying) { }

  ngOnInit() {
    this.subscription.add(this.route.queryParams.subscribe(
      params => {
        this.artistId = params.id;
        this.subscription.add(this.artistService.detailArtist(this.artistId).subscribe(
          result => {
            this.artist = result;
            this.artistService.getSongList(this.artistId).subscribe(
              result1 => {
                console.log(result1);
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
  addToPlaying(song) {
    this.subscription.add(this.songService.listenToSong(song.id).subscribe(
      () => {
        this.goToPage(this.pageNumber);
      }
    ));
    this.addSongToPlaying.emitChange(song);
  }

  goToPage(i) {
    this.subscription.add(this.songService.getSongList(i, undefined).subscribe(
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
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
