import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingNoteComponent } from './nursing-note.component';

describe('NursingNoteComponent', () => {
  let component: NursingNoteComponent;
  let fixture: ComponentFixture<NursingNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NursingNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
