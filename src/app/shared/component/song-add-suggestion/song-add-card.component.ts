import { Component, EventEmitter, Output } from '@angular/core';
import { SongUploadData } from '../../../model/song-upload-data';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SongSuggestionComponent } from '../song-suggestion/song-suggestion.component';
import { Song } from '../../../model/song';
import { AuthService } from '../../../service/auth.service';
import { SongEditModalComponent } from '../song-edit-modal/song-edit-modal.component';

@Component({
  selector: 'app-song-suggestion-card',
  templateUrl: './song-add-card.component.html',
  styleUrls: ['./song-add-card.component.scss']
})
export class SongAddCardComponent {
  @Output() selectSongEvent: EventEmitter<SongUploadData | void> = new EventEmitter<SongUploadData | void>();
  suggestionRef: NgbModalRef;

  constructor(private modalService: NgbModal, private authService: AuthService) {}

  openSuggestionDialog(): void {
    this.suggestionRef = this.modalService.open(SongSuggestionComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'md'
    });
    const sub = this.suggestionRef.closed.subscribe((song: Song) => {
      if (song) {
        const songUploadData = SongUploadData.instance(song);
        songUploadData.editable = this.authService.currentUserValue?.user_name === song.uploader?.username;
        songUploadData.type = song.uploader?.username === this.authService.currentUserValue?.user_name ? 'UPDATE' : 'VIEW';
        this.selectSongEvent.emit(songUploadData);
      }
      sub.unsubscribe();
    });
  }

  newSong(): void {
    const ref = this.modalService.open(SongEditModalComponent, {
      animation: true,
      backdrop: false,
      centered: false,
      scrollable: false,
      size: 'lg'
    });
    const instance: SongEditModalComponent = ref.componentInstance;
    const songUploadData = SongUploadData.instance();
    songUploadData.editable = true;
    instance.song = songUploadData.song;
    instance.songUploadData = songUploadData;
    ref.closed.subscribe(song => {
      if (song) {
        songUploadData.song = song;
        this.selectSongEvent.emit(songUploadData);
      }
    });
  }
}
