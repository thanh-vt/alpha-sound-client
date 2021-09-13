import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlbumUploadData } from '../../../model/album-upload-data';
import { DateUtil } from '../../../util/date-util';

@Component({
  selector: 'app-album-edit-card',
  templateUrl: './album-edit-card.component.html',
  styleUrls: ['./album-edit-card.component.scss']
})
export class AlbumEditCardComponent {
  @Input() albumUploadData!: AlbumUploadData;
  @Output() submitEvent: EventEmitter<void> = new EventEmitter<void>();
  minDate = DateUtil.getMinDate();

  onSubmit(): void {
    this.submitEvent.emit();
  }
}
