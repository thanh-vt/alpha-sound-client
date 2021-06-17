import {Injectable, TemplateRef} from '@angular/core';

export interface Toast {
  header: string;
  body: string | TemplateRef<any>;
  options?: ToastOptions;
}

export interface ToastOptions {
  classname?: string;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  readonly toasts: Toast[] = [];

  show(header: string, body: string, options?: ToastOptions) {
    this.toasts.push({header, body, options});
  }

  success(header: string, body: string) {
    this.show(header, body, {classname: 'bg-success text-light', delay: 3000});
  }

  error(header: string, body: string) {
    this.show(header, body, {classname: 'bg-danger text-light', delay: 3000});
  }

  warning(header: string, body: string) {
    this.show(header, body, {classname: 'bg-warning text-dark', delay: 3000});
  }

  info(header: string, body: string) {
    this.show(header, body, {classname: 'bg-info text-light', delay: 3000});
  }

  remove(toast) {
    const index = this.toasts.indexOf(toast);
    this.toasts.splice(index, 1);
  }
}
