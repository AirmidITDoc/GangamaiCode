import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMaterialConsumptionReturnComponent } from './patient-material-consumption-return.component';

describe('PatientMaterialConsumptionReturnComponent', () => {
  let component: PatientMaterialConsumptionReturnComponent;
  let fixture: ComponentFixture<PatientMaterialConsumptionReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMaterialConsumptionReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMaterialConsumptionReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
