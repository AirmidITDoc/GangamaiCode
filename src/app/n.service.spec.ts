import { TestBed } from '@angular/core/testing';

import { NService } from './n.service';

describe('NService', () => {
  let service: NService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
