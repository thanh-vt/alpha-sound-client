import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isPoppedUp = false;
  @Input() title = '';
  @Input() body: string;
  @Input() action: string;
  @Input() disableClose = false;
  closeResult: string;
  @ViewChild('content', {static: false}) content: ElementRef;

  constructor(private modalService: NgbModal) {
  }

  ngAfterViewInit(): void {
    if (this.isPoppedUp) {
      // tslint:disable-next-line:max-line-length
      this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, scrollable: true}).result.then(() => {
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isPoppedUp) {
      this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', scrollable: true});
    } else {
      this.modalService.dismissAll();
    }
  }

  ngOnInit() {
    if (this.isPoppedUp) {
      this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', scrollable: true } ).result.then(() => {
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title', scrollable: true } ).close();
    }
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', scrollable: true}).result.then(() => {
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
}
