import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneappointmentComponent } from './phoneappointment.component';

describe('PhoneappointmentComponent', () => {
  let component: PhoneappointmentComponent;
  let fixture: ComponentFixture<PhoneappointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneappointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
