import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorShareComponent } from './doctor-share.component';

describe('DoctorShareComponent', () => {
  let component: DoctorShareComponent;
  let fixture: ComponentFixture<DoctorShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
