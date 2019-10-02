import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  error = '';
  message: string;
  closeResult: string;
  @Output() addPlaylist = new EventEmitter();
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
      this.addPlaylist.emit();
      this.message = '';
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

  onSubmit() {
    this.playlistService.createPlaylist(this.createPlaylistForm.value).subscribe(
      result => {
        this.message = 'Playlist created successfully!';
        this.createPlaylistForm.reset({name});
      },
      error => {
        this.message = 'Failed to create playlist. Cause: ' + error.message;
        console.log(error);
      }
    );
  }

}

