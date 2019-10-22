import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {PlaylistService} from '../../service/playlist.service';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.scss']
})
export class EditPlaylistComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() playlistName: string;
  playlistEditForm: FormGroup;
  loading = false;
  error = false;
  message: string;
  @Output() editPlaylist = new EventEmitter();
  subscription: Subscription = new Subscription();
  constructor(private modalService: NgbModal, private fb: FormBuilder,
              private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.playlistEditForm = this.fb.group({
        title: [this.playlistName, Validators.required],
      }
    );
  }

  open(content, event) {
    event.stopPropagation();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
    }, (reason) => {
      this.editPlaylist.emit();
      this.message = '';
      console.log(this.getDismissReason(reason));
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
    this.subscription.add(this.playlistService.editPlaylist(this.playlistEditForm.value, this.id).subscribe(
      () => {
        this.error = false;
        this.message = 'Playlist deleted successfully!';
      },
      error => {
        this.error = true;
        this.message = 'Failed to delete playlist. Cause: ' + error.message;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
