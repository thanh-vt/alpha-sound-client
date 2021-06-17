import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() type: number;
  @Input() title: string;
  @Input() imgSrc: string;
  @Input() showEditButton: boolean;
  @Output() showEditForm = new EventEmitter();
  @Input() tileHoverEffect: boolean;

  constructor() { }

  ngOnInit() {
  }

  showHideEditForm() {
    this.showEditForm.emit();
  }

}
