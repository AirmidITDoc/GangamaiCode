import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialysisSMSComponent } from './dialysis-sms.component';

describe('DialysisSMSComponent', () => {
  let component: DialysisSMSComponent;
  let fixture: ComponentFixture<DialysisSMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialysisSMSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialysisSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
