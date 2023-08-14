import { TestBed } from '@angular/core/testing';

import { BatchAndExpDateAdjustmentService } from './batch-and-exp-date-adjustment.service';

describe('BatchAndExpDateAdjustmentService', () => {
  let service: BatchAndExpDateAdjustmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchAndExpDateAdjustmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
