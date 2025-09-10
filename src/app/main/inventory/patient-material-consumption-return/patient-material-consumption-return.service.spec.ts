import { TestBed } from '@angular/core/testing';

import { PatientMaterialConsumptionReturnService } from './patient-material-consumption-return.service';

describe('PatientMaterialConsumptionReturnService', () => {
  let service: PatientMaterialConsumptionReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientMaterialConsumptionReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
