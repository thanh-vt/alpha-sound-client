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
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { UserProfile } from '../../model/token-response';
import { AddSongToPlaylistComponent } from '../../playlist/add-song-to-playlist/add-song-to-playlist.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/component/modal/confirmation-modal/confirmation-modal.component';
import { ArtistService } from '../../service/artist.service';
import { PagingInfo } from '../../model/paging-info';
import { DataUtil } from '../../util/data-util';
import { VgLoaderService } from 'ngx-vengeance-lib';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit, OnDestroy {
  currentUser: UserProfile;
  song: Song;
  songId: number;
  artistPage: PagingInfo<Artist> = DataUtil.initPagingInfo(5);
  commentList: Comment[];
  commentForm: FormGroup = this.fb.group({
    content: ['']
  });
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private songService: SongService,
    private artistService: ArtistService,
    private userService: UserProfileService,
    private playlistService: PlaylistService,
    public translate: TranslateService,
    private modalService: NgbModal,
    private loaderService: VgLoaderService
  ) {
    this.subscription.add(
      this.authService.currentUser$.subscribe(next => {
        this.currentUser = next;
      })
    );
  }

  ngOnInit(): void {
    this.retrieveSongList();
  }

  retrieveSongList(): void {
    this.subscription.add(
      this.route.queryParams.subscribe(async params => {
        try {
          this.songId = params.id;
          this.loaderService.loading(true);
          this.song = await this.songService.songDetail(this.songId).toPromise();
          await this.getArtistList();
          this.commentList = this.song.comments;
        } catch (e) {
          console.error(e);
        } finally {
          this.loaderService.loading(false);
        }
      })
    );
  }

  async getArtistList(page = 0): Promise<void> {
    this.artistPage = await this.artistService
      .searchArtist({
        songId: `${this.songId}`,
        page: `${page}`,
        size: `${this.artistPage.pageable?.pageSize}`
      })
      .toPromise();
  }

  async onSubmit(): Promise<void> {
    try {
      await this.songService.commentSong(this.songId, this.commentForm.value).toPromise();
      this.song = await this.songService.songDetail(this.songId).toPromise();
      this.commentForm.reset();
      this.artistPage = await this.artistService.artistList().toPromise();
      this.commentList = this.song.comments;
    } catch (e) {
      console.error(e);
    }
  }

  addToPlaying(song: Song, event: Event): void {
    event.stopPropagation();
    this.songService.songDetail(song.id).subscribe(next => {
      song.url = next.url;
      this.songService.play(song);
    });
  }

  likeSong(song: Song, event: Event, isLiked: boolean): void {
    event.stopPropagation();
    this.songService.likeSong(song, isLiked);
  }

  openPlaylistDialog(songId: number, event: Event): void {
    event.stopPropagation();
    const ref = this.modalService.open(AddSongToPlaylistComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    ref.componentInstance.songId = songId;
  }

  openDeleteCommentDialog(commentId: number): void {
    const dialogRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const comp: ConfirmationModalComponent = dialogRef.componentInstance;
    comp.subject = this.translate.instant('common.entity.comment');
    comp.data = commentId;
    const sub: Subscription = dialogRef.closed.subscribe(result => {
      if (result) {
        this.songService
          .deleteComment(commentId)
          .pipe(
            finalize(() => {
              sub.unsubscribe();
            })
          )
          .subscribe(() => {
            this.retrieveSongList();
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
