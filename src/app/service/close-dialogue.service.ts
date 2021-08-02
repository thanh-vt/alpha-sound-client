import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloseDialogueService {
  private closeDialogueSubject = new Subject();
  public closeDialogueSubjectValue = this.closeDialogueSubject.asObservable();

  constructor() {}

  emitCloseDialogue(change: any) {
    this.closeDialogueSubject.next(change);
  }
}
