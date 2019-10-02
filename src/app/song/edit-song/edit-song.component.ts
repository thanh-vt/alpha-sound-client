import {Component, OnInit} from '@angular/core';
import {Song} from '../../model/song';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SongService} from '../../service/song.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.scss']
})
export class EditSongComponent implements OnInit {
  song: Song;
  songUpdateForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.songUpdateForm = this.fb.group({
      name: ['', Validators.required],
      artists: ['', Validators.required],
      releaseDate: [''],
      album: [null],
      genres: [''],
      tags: [''],
      mood: [''],
      activity: ['']
    });

  }

  onSubmit() {
    const id = +this.route.snapshot.paramMap.get('id');
    if (this.songUpdateForm.valid) {
      const {value} = this.songUpdateForm;
      const data = {
        ...this.song,
        ...value
      };
      this.songService.updateSong(data, id).subscribe(
        next => {
          console.log('song updated successfully');
        }, error => console.log(error)
      );
    }
  }
}
