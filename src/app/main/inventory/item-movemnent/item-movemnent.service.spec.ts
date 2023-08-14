import { TestBed } from '@angular/core/testing';

import { ItemMovemnentService } from './item-movemnent.service';

describe('ItemMovemnentService', () => {
  let service: ItemMovemnentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemMovemnentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
