import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModeChangePharmacyComponent } from './payment-mode-change-pharmacy.component';

describe('PaymentModeChangePharmacyComponent', () => {
  let component: PaymentModeChangePharmacyComponent;
  let fixture: ComponentFixture<PaymentModeChangePharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentModeChangePharmacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModeChangePharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
