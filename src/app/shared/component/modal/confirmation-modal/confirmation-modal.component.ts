import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() subject: string;
  @Input() name: string;
  @Input() data: any;
  @Input() confirmDelete = true;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  accept(): void {
    this.ngbActiveModal.close(this.data);
  }

  close(): void {
    this.ngbActiveModal.close(null);
  }
}
