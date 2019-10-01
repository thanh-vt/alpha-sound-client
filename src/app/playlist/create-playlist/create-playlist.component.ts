import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {PlaylistService} from '../../service/playlist.service';
@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss']
})
export class CreatePlaylistComponent implements OnInit {
  createPlaylistForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  file: File;
  formData = new FormData();
  message: string;
  closeResult: string;
  constructor(private modalService: NgbModal, private fb: FormBuilder,
              private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.createPlaylistForm = this.fb.group({
      name: ['', Validators.required],
      }
    );
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  selectFile(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
  onSubmit() {
    this.playlistService.createPlaylist(this.createPlaylistForm.value).subscribe(
      result => {
        this.message = 'Playlist created successfully!';
        console.log(result);
      },
      error => {
        this.message = 'Failed to create playlist. Cause: ' + error.message;
        console.log(error);
      }
    );
  }

}

