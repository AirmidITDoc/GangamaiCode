import { TestBed } from '@angular/core/testing';

import { CurrentStockService } from './current-stock.service';

describe('CurrentStockService', () => {
  let service: CurrentStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
