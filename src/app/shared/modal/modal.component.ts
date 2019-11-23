import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnInit, Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CloseDialogueService} from '../../services/close-dialogue.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() isPoppedUp = false;
  @Input() title = '';
  @Input() body: string;
  @Input() action: string;
  @Input() disableClose = false;
  closeResult: string;
  @Output() closeAction = new EventEmitter();
  @ViewChild('content', {static: false}) content: ElementRef;

  constructor(private modalService: NgbModal, private closeDialogueService: CloseDialogueService) {
    this.closeDialogueService.closeDialogueSubjectValue.subscribe(
      next => {
        const closeAction = setTimeout(() => {
          this.modalService.dismissAll();
          clearTimeout(closeAction);
        }, 1500);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isPoppedUp) {
      this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', scrollable: true, backdrop: 'static' });
    } else {
      this.modalService.dismissAll();
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.isPoppedUp) {
      // tslint:disable-next-line:max-line-length
      this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', scrollable: true, backdrop: 'static' } ).result.then(() => {
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', scrollable: true, backdrop: 'static' } ).close();
    }
  }

  open(content, event) {
    event.stopPropagation();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', scrollable: true}).result.then(() => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  close() {
    this.closeAction.emit();
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
}
