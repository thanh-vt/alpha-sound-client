import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {Artist} from '../../model/artist';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';
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
export class ArtistDetailComponent implements OnInit {
  private message;
  @Input() artist: Artist;
  private pageNumber: number;
  private pageSize: number;
  private pages: Page[] = [];
  private songList: Song[];
  private isDisable: boolean;
  private subscription: Subscription;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private artistService: ArtistService, private songservice: SongService, private addSongToPlaying: AddSongToPlaying) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.artistService.detailArtist(id).subscribe(
      result => {
        this.artist = result;
        this.artistService.getSongList(id).subscribe(
          result1 => {
            console.log(result1);
            if (result1 != null) {
              this.songList = result1.content;
              // this.songList = this.artist.songs;

            }
          }, error => {
            this.message = 'Cannot retrieve Playlist . Cause: ' + error.message;
          }
        );
      }
    );
  }
  addToPlaying(song) {
    song.isDisabled = true;
    this.addSongToPlaying.emitChange(song);
  }

  goToPage(i) {
    this.subscription.add(this.songservice.getSongListPage(i).subscribe(
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
            this.pages[j] = {pageNumber: i};
          }
          this.isDisable = false;
        }
      }, error => {
        this.isDisable = true;
        this.message = 'Cannot retrieve song list. Cause: ' + error.songsMessage;
      }
    ));
  }

}
