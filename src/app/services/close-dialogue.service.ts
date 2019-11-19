import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {EventEmitter} from 'events';

@Injectable({
  providedIn: 'root'
})
export class CloseDialogueService {

  private deleteCommentDialogueSubject = new Subject();
  public deleteCommentDialogueSubjectValue = this.deleteCommentDialogueSubject.asObservable();

  constructor() {

  }

  emitCloseDeleteDialogue(change: any) {
    this.deleteCommentDialogueSubject.next(change);
  }
}
