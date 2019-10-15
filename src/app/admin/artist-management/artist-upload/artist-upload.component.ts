import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArtistService} from '../../../service/artist.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {HttpEvent} from '@angular/common/http';

@Component({
  selector: 'app-artist-upload',
  templateUrl: './artist-upload.component.html',
  styleUrls: ['./artist-upload.component.scss']
})
export class ArtistUploadComponent implements OnInit, OnDestroy {

  constructor(private artistService: ArtistService, private fb: FormBuilder) {
  }

  submitted = false;
  isImageFileChosen = false;
  imageFileName = '';
  message: string;
  artistUploadForm: FormGroup;
  formData = new FormData();
  file: any;
  subscription: Subscription = new Subscription();

  ngOnInit() {
    this.artistUploadForm = this.fb.group({
      name: ['', [Validators.required, Validators.min(4)]],
      birthDate: ['', Validators.required],
      biography: ['', Validators.required]
    });
  }
  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isImageFileChosen = true;
      this.imageFileName = event.target.files[0].name;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.artistUploadForm.invalid) {
      return;
    }
    this.formData.append('artist', new Blob([JSON.stringify(this.artistUploadForm.value)], {type: 'application/json'}));
    this.formData.append('avatar', this.file);
    this.subscription.add(this.artistService.uploadArtist(this.formData).subscribe(
      (event: HttpEvent<any>) => {
        this.message = 'Artist uploaded successfully!';
      }, error => {
        this.message = 'Failed to upload artist. Cause: ' + error.message ;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
