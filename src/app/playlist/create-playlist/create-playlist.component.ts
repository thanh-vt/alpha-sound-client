import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {PlaylistService} from '../../service/playlist.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss']
})
export class CreatePlaylistComponent implements OnInit {

  createPlaylistForm: FormGroup;
  loading = false;
  error = false;
  message: string;
  subscription: Subscription = new Subscription();
  @Output() createPlaylist = new EventEmitter();

  constructor(private modalService: NgbModal, private fb: FormBuilder,
              private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private playlistService: PlaylistService) {
  }

  ngOnInit(): void {
    this.createPlaylistForm = this.fb.group({
        title: ['', Validators.required],
      }
    );
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      this.message = null;
    }, () => {
      this.createPlaylist.emit();
    });
  }

  onSubmit() {
    this.subscription.add(this.playlistService.createPlaylist(this.createPlaylistForm.value).subscribe(
      () => {
        this.error = false;
        this.message = 'Playlist created successfully!';
        this.createPlaylistForm.reset({name});
      },
      error => {
        this.error = true;
        this.message = 'Failed to create playlist. Cause: ' + error.message;
      }
    ));
  }
}
