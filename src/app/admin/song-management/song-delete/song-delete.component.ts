import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {SongService} from '../../../service/song.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-song-delete',
  templateUrl: './song-delete.component.html',
  styleUrls: ['./song-delete.component.scss']
})
export class SongDeleteComponent implements OnInit, OnDestroy {
  deleted: boolean;
  @Input() songTitle: string;
  @Input() id: number;
  loading = false;
  message: string;
  error = false;
  subscription: Subscription = new Subscription();
  @Output() deleteSong = new EventEmitter();
  constructor(private songService: SongService, private modalService: NgbModal, private router: Router, private route: ActivatedRoute) { }


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
    }, (reason) => {
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
  ngOnInit() {
    this.deleted = false;
  }
  onSubmit() {
    this.subscription.add(
      this.songService.deleteSong(this.id).subscribe(
        result => {
          this.deleteSong.emit();
          console.log(this.id);
          this.error = false;
          this.deleted = true;
          this.message = 'Song deleted successfully!';
        },
        error => {
          this.error = true;
          this.message = 'Failed to delete song. Cause: ' + error.message;
        }
      ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
