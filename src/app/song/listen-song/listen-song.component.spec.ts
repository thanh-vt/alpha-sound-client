import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListenSongComponent } from './listen-song.component';

describe('ListenSongComponent', () => {
  let component: ListenSongComponent;
  let fixture: ComponentFixture<ListenSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListenSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListenSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
