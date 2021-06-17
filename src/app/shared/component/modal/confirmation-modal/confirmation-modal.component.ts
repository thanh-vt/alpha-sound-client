import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  subject: string;
  name: string;

  constructor(private ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  accept(): void {
    this.ngbActiveModal.close(true);
  }

  close(): void {
    this.ngbActiveModal.close(false);
  }
}
