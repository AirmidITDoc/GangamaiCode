import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMaterialConsumptionComponent } from './patient-material-consumption.component';

describe('PatientMaterialConsumptionComponent', () => {
  let component: PatientMaterialConsumptionComponent;
  let fixture: ComponentFixture<PatientMaterialConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMaterialConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMaterialConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
