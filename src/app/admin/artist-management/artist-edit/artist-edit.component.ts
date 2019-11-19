import {Component, Input, OnInit} from '@angular/core';
import {ArtistService} from '../../../services/artist.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Artist} from '../../../model/artist';
import {Progress} from '../../../model/progress';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.scss']
})
export class ArtistEditComponent implements OnInit {
  artistUpdateForm: FormGroup;
  isImageFileChoosen = false;
  imageFileName = '';
  formData = new FormData();
  file: any;
  subscription: Subscription = new Subscription();
  message: string;
  @Input() artist: Artist;
  error = false;
  progress: Progress = {value: 0};


  constructor(private artistService: ArtistService, private fb: FormBuilder, private authService: AuthService,
              private route: ActivatedRoute, private router: Router) {
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
      this.isImageFileChoosen = true;
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
    const id = +this.route.snapshot.paramMap.get('id');
    console.log(this.artistUpdateForm.value);
    // this.userService.updateProfile(this.updateForm.value, id).subscribe(
    //   result => {
    //     this.message = 'Song created successfully!';
    //     this.formData.append('id', String(result));
    //     this.formData.append('avatar', this.file);
    //     this.userService.uploadAvatar(this.formData).subscribe(
    //       (event: HttpEvent<any>) => {
    //         switch (event.type) {
    //           case HttpEventType.Sent:
    //             console.log('Request has been made!');
    //             break;
    //           case HttpEventType.ResponseHeader:
    //             console.log('Response header has been received!');
    //             break;
    //
    //           case HttpEventType.Response:
    //             console.log('User successfully updated!', event.body);
    //         }
    //         this.message = 'Avatar uploaded successfully!';
    //       },
    //       error1 => {
    //         this.message = 'Failed to upload avatar. Cause: ' + error1.message;
    //       }
    //     );
    //   }, error => {
    //     this.message = 'Failed to update user. Cause: ' + error.message;
    //   }
    // );
    this.formData.append('artist', new Blob([JSON.stringify(this.artistUpdateForm.value)], {type: 'application/json'}));
    this.formData.append('avatar', this.file);
    console.log(this.formData);
    this.artistService.updateArtist(this.formData, id).subscribe(
      (event: HttpEvent<any>) => {
        if (this.displayProgress(event, this.progress)) {
          this.error = false;
          this.message = 'Update artist success';
        }
      },
      error => {
        console.log(error.message);
        this.error = true;
        this.message = 'Failed update artist';
      }
    );
  }

  navigate() {
    location.replace('/admin/artist');
  }
}
