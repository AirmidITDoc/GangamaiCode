import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IPRefundofBillComponent } from './ip-refundof-bill.component';

describe('IPRefundofBillComponent', () => {
  let component: IPRefundofBillComponent;
  let fixture: ComponentFixture<IPRefundofBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IPRefundofBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IPRefundofBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
