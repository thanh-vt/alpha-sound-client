import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalWrapperComponent {
  @Input() title = '';
  @Input() disableClose = false;
  @Output() closeAction = new EventEmitter();
  @ViewChild('content') content: ElementRef;

  constructor() {}

  close() {
    this.closeAction.emit();
  }
}
