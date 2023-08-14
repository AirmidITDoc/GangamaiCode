import { TestBed } from '@angular/core/testing';

import { PatientMaterialConsumptionService } from './patient-material-consumption.service';

describe('PatientMaterialConsumptionService', () => {
  let service: PatientMaterialConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientMaterialConsumptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
