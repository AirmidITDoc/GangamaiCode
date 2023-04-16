import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpRefundBillComponent } from './op-refund-bill.component';

describe('OpRefundBillComponent', () => {
  let component: OpRefundBillComponent;
  let fixture: ComponentFixture<OpRefundBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpRefundBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpRefundBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
