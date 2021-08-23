import { Component, OnInit } from '@angular/core';
import { AppLoaderService } from './app-loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss']
})
export class AppLoaderComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private loaderService: AppLoaderService) {
    this.loading$ = this.loaderService.getLoader();
  }

  ngOnInit(): void {}
}
