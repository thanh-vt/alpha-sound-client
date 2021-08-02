import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { SongService } from '../../service/song.service';
import { Artist } from '../../model/artist';
import { Song } from '../../model/song';
import { Comment } from '../../model/comment';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../../service/user-profile.service';
import { PlaylistService } from '../../service/playlist.service';
import { PlayingQueueService } from '../../service/playing-queue.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../model/token-response';
import { CloseDialogueService } from '../../service/close-dialogue.service';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit, OnDestroy {
  song: Song;
  currentUser: UserProfile;
  message: string;
  loading: boolean;
  songId: number;
  artistList: Artist[];
  commentList: Comment[];
  commentForm: FormGroup;
  error = false;
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private songService: SongService,
    private closeDialogueService: CloseDialogueService,
    private userService: UserProfileService,
    private playlistService: PlaylistService,
    private playingQueueService: PlayingQueueService,
    public translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.subscription.add(
      this.authService.currentUser$.subscribe(
        next => {
          this.currentUser = next;
        },
        error => {
          this.message = 'An error has occurred.';
          console.log(error);
        }
      )
    );
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      content: ['']
    });
    this.retrieveSongList();
  }

  retrieveSongList() {
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        this.songId = params.id;
        this.loading = true;
        this.subscription.add(
          this.songService
            .songDetail(this.songId)
            .pipe(
              finalize(() => {
                this.loading = false;
              })
            )
            .subscribe(
              result => {
                window.scroll(0, 0);
                this.song = result;
                this.artistList = this.song.artists;
                this.commentList = this.song.comments;
                this.checkDisabledSong(this.song);
              },
              error => {
                this.message = 'An error has occurred.';
                console.log(error);
              }
            )
        );
      })
    );
  }

  onSubmit() {
    this.subscription.add(
      this.songService.commentSong(this.songId, this.commentForm.value).subscribe(() => {
        this.subscription.add(
          this.songService.songDetail(this.songId).subscribe(
            result => {
              this.commentForm.reset();
              this.song = result;
              this.artistList = this.song.artists;
              this.commentList = this.song.comments;
            },
            error => {
              this.message = 'Cannot retrieve Song . Cause: ' + error.message;
            }
          )
        );
      })
    );
  }

  addToPlaying(song: Song, event) {
    event.stopPropagation();
    this.playingQueueService.addToQueue(song);
  }

  likeSong(song: Song, event, isLiked: boolean) {
    event.stopPropagation();
    this.songService.likeSong(song, isLiked);
  }

  checkDisabledSong(song: Song) {
    let isDisabled = false;
    for (const track of this.playingQueueService.currentQueueSubject.value) {
      if (song.url === track.link) {
        isDisabled = true;
        break;
      }
    }
    song.isDisabled = isDisabled;
  }

  openPlaylistDialog(songId: number, event: Event) {
    event.stopPropagation();
    const ref = this.modalService.open(AddSongToPlaylistComponent, { animation: true });
    ref.componentInstance.songId = songId;
  }

  deleteComment(commentId: number) {
    this.subscription.add(
      this.songService.deleteComment(commentId).subscribe(
        () => {
          const deleteAction = setTimeout(() => {
            this.retrieveSongList();
            this.closeDialogueService.emitCloseDialogue(true);
            clearTimeout(deleteAction);
          }, 1500);
        },
        error => {
          this.message = 'Cannot delete comment';
          console.log(error.message);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
