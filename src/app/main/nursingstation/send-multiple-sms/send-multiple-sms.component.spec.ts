import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMultipleSMSComponent } from './send-multiple-sms.component';

describe('SendMultipleSMSComponent', () => {
  let component: SendMultipleSMSComponent;
  let fixture: ComponentFixture<SendMultipleSMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendMultipleSMSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMultipleSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
