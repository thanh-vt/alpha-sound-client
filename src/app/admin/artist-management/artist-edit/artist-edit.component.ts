import {Component, OnInit} from '@angular/core';
import {ArtistService} from '../../../service/artist.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Artist} from '../../../model/artist';

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
  artist: Artist;

  constructor(private artistService: ArtistService, private fb: FormBuilder, private authService: AuthService,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.artistUpdateForm = this.fb.group({
        name: ['', Validators.required],
        birthDate: ['', Validators.required],
        biography: ['', Validators.required]
      }
    );
    this.artistService.getArtistDetail(id).subscribe(
      result => {
        this.artist = result;
        this.artistUpdateForm = this.fb.group({
          name: [this.artist.name, Validators.required],
          birthDate: [this.artist.birthDate, Validators.required],
          biography: [this.artist.biography, Validators.required]
        });
      }
    );
  }
  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.isImageFileChoosen = true;
      this.imageFileName = event.target.files[0].name;
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
      next => {
        console.log('ok');
        this.message = 'Update artist success';
      },
      error => {
        console.log('not ok!');
        this.message = 'Failed update artist';
      }
    );
  }
}
