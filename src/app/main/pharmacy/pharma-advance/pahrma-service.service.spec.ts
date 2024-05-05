import { TestBed } from '@angular/core/testing';

import { PahrmaServiceService } from './pahrma-service.service';

describe('PahrmaServiceService', () => {
  let service: PahrmaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PahrmaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
