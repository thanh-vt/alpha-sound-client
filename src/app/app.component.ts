import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from './service/auth.service';
import {Token} from './model/token';
import {Track} from 'ngx-audio-player';


@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {

  constructor() { }
}
