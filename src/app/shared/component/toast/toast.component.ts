import {Component, OnInit, TemplateRef} from '@angular/core';
import {Toast, ToastService} from '../../service/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {

  constructor(public readonly toastService: ToastService) {}

  ngOnInit(): void {
  }

  isTemplate(toast: Toast) {
    return toast.body instanceof TemplateRef;
  }
}
