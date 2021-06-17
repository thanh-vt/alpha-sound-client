import {Component, Input, OnInit} from '@angular/core';
import {ArtistService} from '../../../service/artist.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Artist} from '../../../model/artist';
import {Progress} from '../../../model/progress';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.scss']
})
export class ArtistEditComponent implements OnInit {

  @Input() artist: Artist;
  artistUpdateForm: FormGroup;
  isImageFileChosen = false;
  imageFileName = '';
  formData = new FormData();
  file: any;
  subscription: Subscription = new Subscription();
  message: string;
  error = false;
  progress: Progress = {value: 0};

  constructor(private artistService: ArtistService, private fb: FormBuilder,
              private ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.artistUpdateForm = this.fb.group({
      name: [this.artist.name, Validators.required],
      birthDate: [this.artist.birthDate, Validators.required],
      biography: [this.artist.biography, Validators.required]
    });
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isImageFileChosen = true;
      this.imageFileName = event.target.files[0].name;
    }
  }

  displayProgress(event, progress: Progress): boolean {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        break;
      case HttpEventType.UploadProgress:
        progress.value = Math.round(event.loaded / event.total * 100);
        console.log(`Uploaded! ${progress.value}%`);
        break;
      case HttpEventType.Response:
        console.log('Song successfully created!', event.body);
        const complete = setTimeout(() => {
          progress.value = 0;
          const navigation = setInterval(() => {
            this.navigate();
            clearTimeout(navigation);
            clearTimeout(complete);
          }, 2000);
        }, 500);
        return true;
    }
  }

  onSubmit() {
    // const id = +this.route.snapshot.paramMap.get('id');
    this.formData.append('artist', new Blob([JSON.stringify(this.artistUpdateForm.value)], {type: 'application/json'}));
    this.formData.append('avatar', this.file);
    this.artistService.updateArtist(this.formData, this.artist.id).subscribe(
      (event: HttpEvent<any>) => {
        if (this.displayProgress(event, this.progress)) {
          this.error = false;
          this.message = 'Update artist successfully.';
        }
      },
      error => {
        this.error = true;
        this.message = 'Failed to update artist';
        console.log(error.message);
      }
    );
  }

  navigate() {
    location.replace('/admin/artist-management');
  }

  close() {
    this.ngbActiveModal.dismiss();
  }
}
