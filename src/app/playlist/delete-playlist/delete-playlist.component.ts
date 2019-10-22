import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {PlaylistService} from '../../service/playlist.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-delete-playlist',
  templateUrl: './delete-playlist.component.html',
  styleUrls: ['./delete-playlist.component.scss']
})
export class DeletePlaylistComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() playlistName: string;
  deleted: boolean;
  loading = false;
  error = false;
  message: string;
  subscription: Subscription = new Subscription();

  @Output() deletePlaylist = new EventEmitter();
  constructor(private modalService: NgbModal, private fb: FormBuilder,
              private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.deleted = false;
  }

  open(content, event) {
    event.stopPropagation();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
    }, (reason) => {
      this.deletePlaylist.emit();
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
    this.subscription.add(this.playlistService.deletePlaylist(this.id).subscribe(
      () => {
        this.error = false;
        this.deleted = true;
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
