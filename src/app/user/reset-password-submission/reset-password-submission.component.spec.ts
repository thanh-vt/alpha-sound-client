import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordSubmissionComponent } from './reset-password-submission.component';

describe('ResetPasswordSubmissionComponent', () => {
  let component: ResetPasswordSubmissionComponent;
  let fixture: ComponentFixture<ResetPasswordSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordSubmissionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
