import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {PlaylistService} from '../../service/playlist.service';
import {SongService} from '../../service/song.service';
import {environment} from '../../../environments/environment';

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

  constructor(private modalService: NgbModal, private fb: FormBuilder,
              private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private songService: SongService) {
  }

  ngOnInit(): void {
    this.deleted = false;
  }

  open(content, event) {
    event.stopPropagation();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      this.message = '';
    }, (reason) => {
      this.deleteSongPlaylist.emit();
      console.log(this.getDismissReason(reason));
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit() {
    this.songService.deleteSongFromPlaylist(this.songId, this.playlistId).subscribe(
      result => {
        this.error = false;
        this.deleted = true;
        this.message = 'Song from playlist removed successfully.';
        this.router.navigate(['/playlist/detail'], { queryParams: {id: this.playlistId}});
      },
      error => {
        this.error = true;
        this.message = 'Failed to remove song playlist.';
        console.log(error.message);
      }
    );
  }
}
