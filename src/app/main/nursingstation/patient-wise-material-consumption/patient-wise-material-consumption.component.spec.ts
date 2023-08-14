import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientWiseMaterialConsumptionComponent } from './patient-wise-material-consumption.component';

describe('PatientWiseMaterialConsumptionComponent', () => {
  let component: PatientWiseMaterialConsumptionComponent;
  let fixture: ComponentFixture<PatientWiseMaterialConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientWiseMaterialConsumptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientWiseMaterialConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
