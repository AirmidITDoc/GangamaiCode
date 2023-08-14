import { TestBed } from '@angular/core/testing';

import { GstAdjustmentService } from './gst-adjustment.service';

describe('GstAdjustmentService', () => {
  let service: GstAdjustmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GstAdjustmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
