import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
              private playlistService: PlaylistService) {}

  ngOnInit(): void {

  }

  onSubmit() {
    this.createPlaylist.emit();
  }

}

