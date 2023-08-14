import { TestBed } from '@angular/core/testing';

import { MrpAdjustmentService } from './mrp-adjustment.service';

describe('MrpAdjustmentService', () => {
  let service: MrpAdjustmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MrpAdjustmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
