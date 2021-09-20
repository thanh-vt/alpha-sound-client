import { Component, EventEmitter, Output } from '@angular/core';
import { SongUploadData } from '../../../model/song-upload-data';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SongSuggestionComponent } from '../song-suggestion/song-suggestion.component';
import { FormArray, FormBuilder } from '@angular/forms';
import { Song } from '../../../model/song';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-song-suggestion-card',
  templateUrl: './song-add-card.component.html',
  styleUrls: ['./song-add-card.component.scss']
})
export class SongAddCardComponent {
  @Output() selectSongEvent: EventEmitter<SongUploadData | void> = new EventEmitter<SongUploadData | void>();
  suggestionRef: NgbModalRef;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private authService: AuthService) {}

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
        const songUploadData = SongUploadData.instance(this.fb);
        songUploadData.type = 'view';
        songUploadData.editable = this.authService.currentUserValue?.user_name === song.uploader?.username;
        songUploadData.editing = false;
        songUploadData.formGroup.patchValue(song);
        const artistFormArr = songUploadData.formGroup.get('artists') as FormArray;
        artistFormArr.clear();
        song.artists.forEach(artist => {
          artistFormArr.push(this.fb.control(artist));
        });
        songUploadData.type = song.uploader?.username === this.authService.currentUserValue?.user_name ? 'update' : 'view';
        this.selectSongEvent.emit(songUploadData);
      }
      sub.unsubscribe();
    });
  }

  newSong(): void {
    this.selectSongEvent.emit();
  }
}
