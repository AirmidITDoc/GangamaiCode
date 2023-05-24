import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OPRefundofBillComponent } from './op-refundof-bill.component';

describe('OPRefundofBillComponent', () => {
  let component: OPRefundofBillComponent;
  let fixture: ComponentFixture<OPRefundofBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPRefundofBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPRefundofBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
