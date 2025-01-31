import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentBillingComponent } from './appointment-billing.component';

describe('AppointmentBillingComponent', () => {
  let component: AppointmentBillingComponent;
  let fixture: ComponentFixture<AppointmentBillingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentBillingComponent]
    });
    fixture = TestBed.createComponent(AppointmentBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
