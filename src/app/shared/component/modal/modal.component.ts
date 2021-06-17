import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SettingService} from '../../../service/setting.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnChanges, AfterViewInit {

  constructor(private ngbActiveModal: NgbActiveModal, private ngbModal: NgbModal,
              private settingService: SettingService) {
    this.settingService.setting$.subscribe(
      next => {
        if (next) {
          this.darkThemeOn = next.darkMode;
        }
      }
    );
  }

  @Input() isPoppedUp = false;
  @Input() title = '';
  @Input() body: string;
  @Input() action: string;
  @Input() disableClose = false;
  @Input() darkThemeOn: boolean;
  @Output() closeAction = new EventEmitter();
  @ViewChild('content') content: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  close() {
    this.ngbActiveModal.close();
  }
}
