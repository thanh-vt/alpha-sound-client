import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss']
})
export class ModalWrapperComponent {
  @Input() title = '';
  @Input() disableClose = false;
  @Output() closeAction = new EventEmitter();
  @ViewChild('content') content: ElementRef;

  close(): void {
    this.closeAction.emit();
  }
}
