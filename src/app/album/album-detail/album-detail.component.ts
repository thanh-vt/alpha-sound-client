import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {SongService} from '../../service/song.service';
import {PlayingQueueService} from '../../service/playing-queue.service';
import {Album} from '../../model/album';
import {AlbumService} from '../../service/album.service';
import {Song} from '../../model/song';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit, OnDestroy {

  album: Album;
  albumId;
  songList: Song[];
  subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private albumService: AlbumService, private songService: SongService, private playingQueueService: PlayingQueueService) { }

  ngOnInit() {
    this.subscription.add(this.route.queryParams.subscribe(
      params => {
        this.albumId = params.id;
        this.subscription.add(this.albumService.albumDetail(this.albumId).subscribe(
          result => {
            this.album = result;
            this.songList = result.songs;
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

  addAllToPlaying() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.album.songs.length; i++) {
      this.addToPlaying(this.album.songs[i]);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
