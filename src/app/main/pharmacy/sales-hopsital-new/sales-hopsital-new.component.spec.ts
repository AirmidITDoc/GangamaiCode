import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHospitalNewComponent } from './sales-hopsital-new.component';

describe('SalesHospitalNewComponent', () => {
  let component: SalesHospitalNewComponent;
  let fixture: ComponentFixture<SalesHospitalNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesHospitalNewComponent]
    });
    fixture = TestBed.createComponent(SalesHospitalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
