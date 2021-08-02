import { Component, Inject, OnInit } from '@angular/core';
import { TOAST_DATA, LoadingData } from './loading-data';
import { TOAST_REF, LoadingRef } from './loading-ref';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  progress: number;

  constructor(@Inject(TOAST_DATA) readonly data: LoadingData, @Inject(TOAST_REF) readonly ref: LoadingRef) {}

  ngOnInit(): void {}

  close(): void {
    this.ref.close();
  }
}
