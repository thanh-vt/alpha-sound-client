import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ArtistService} from '../../../services/artist.service';
import {Subscription} from 'rxjs';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-artist-delete',
  templateUrl: './artist-delete.component.html',
  styleUrls: ['./artist-delete.component.scss']
})
export class ArtistDeleteComponent implements OnInit, OnDestroy {
  deleted: boolean;
  @Input() artistName: string;
  @Input() id: number;
  loading = false;
  message: string;
  error = false;
  private subscription: Subscription = new Subscription();
  @Output() deleteArtist = new EventEmitter();

  constructor(private artistService: ArtistService, private modalService: NgbModal, private router: Router, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.deleted = false;
  }
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

  onSubmit() {
    this.subscription.add(
      this.artistService.deleteArtist(this.id).subscribe(
      result => {
        this.deleteArtist.emit();
        console.log(this.id);
        this.error = false;
        this.deleted = true;
        this.message = 'Artist deleted successfully!';
      },
      error => {
        this.error = true;
        this.message = 'Failed to delete artist. Cause: ' + error.message;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
