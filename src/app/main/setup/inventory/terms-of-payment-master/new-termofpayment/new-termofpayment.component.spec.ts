import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTermofpaymentComponent } from './new-termofpayment.component';

describe('NewTermofpaymentComponent', () => {
  let component: NewTermofpaymentComponent;
  let fixture: ComponentFixture<NewTermofpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTermofpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTermofpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
