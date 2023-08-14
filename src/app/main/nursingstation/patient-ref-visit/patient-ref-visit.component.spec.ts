import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRefVisitComponent } from './patient-ref-visit.component';

describe('PatientRefVisitComponent', () => {
  let component: PatientRefVisitComponent;
  let fixture: ComponentFixture<PatientRefVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientRefVisitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRefVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
