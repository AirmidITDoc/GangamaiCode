import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedTransferComponent } from './bed-transfer.component';

describe('BedTransferComponent', () => {
  let component: BedTransferComponent;
  let fixture: ComponentFixture<BedTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BedTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BedTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
