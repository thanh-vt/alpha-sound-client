import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlaylistListComponent } from './modal-playlist-list.component';

describe('ModalPlaylistListComponent', () => {
  let component: ModalPlaylistListComponent;
  let fixture: ComponentFixture<ModalPlaylistListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPlaylistListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPlaylistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
