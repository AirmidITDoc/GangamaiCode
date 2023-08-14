import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPaymentStatusComponent } from './supplier-payment-status.component';

describe('SupplierPaymentStatusComponent', () => {
  let component: SupplierPaymentStatusComponent;
  let fixture: ComponentFixture<SupplierPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierPaymentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
