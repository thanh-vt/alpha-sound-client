import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { PlaylistService } from '../../service/playlist.service';
import { SongService } from '../../service/song.service';
import { environment } from '../../../environments/environment';
import { CloseDialogueService } from '../../service/close-dialogue.service';

@Component({
  selector: 'app-delete-playlist-song',
  templateUrl: './delete-song-from-playlist.html',
  styleUrls: ['./delete-song-from-playlist.scss']
})
export class DeleteSongFromPlaylistComponent implements OnInit {
  @Input() songId: number;
  @Input() playlistId: number;
  @Input() name: string;
  @Output() deleteSongPlaylist = new EventEmitter();
  deleted: boolean;
  loading = false;
  error = false;
  message: string;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private songService: SongService,
    private closeDialogueService: CloseDialogueService
  ) {}

  ngOnInit(): void {
    this.deleted = false;
  }

  onSubmit() {
    this.songService.deleteSongFromPlaylist(this.songId, this.playlistId).subscribe(
      () => {
        this.error = false;
        this.deleted = true;
        this.message = 'Song from playlist removed successfully.';
        const deleteAction = setTimeout(() => {
          this.deleteSongPlaylist.emit();
          this.closeDialogueService.emitCloseDialogue(true);
          clearTimeout(deleteAction);
        }, 1500);
      },
      error => {
        this.error = true;
        this.message = 'Failed to remove song playlist.';
        console.log(error.message);
      }
    );
  }
}
