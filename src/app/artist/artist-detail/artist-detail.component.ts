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
              private artistService: ArtistService, private songService: SongService, private playingQueueService: PlayingQueueService) { }

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

  addToPlaying(song) {
    this.subscription.add(this.songService.listenToSong(song.id).subscribe(
      () => {
        this.playingQueueService.addToQueue({
          title: song.title,
          link: song.url
        });
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
