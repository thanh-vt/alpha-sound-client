import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedSongListComponent } from './uploaded-song-list.component';

describe('UploadedSongListComponent', () => {
  let component: UploadedSongListComponent;
  let fixture: ComponentFixture<UploadedSongListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadedSongListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedSongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
