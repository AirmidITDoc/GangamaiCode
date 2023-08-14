import { TestBed } from '@angular/core/testing';

import { StockAdjustmentService } from './stock-adjustment.service';

describe('StockAdjustmentService', () => {
  let service: StockAdjustmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockAdjustmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
