import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorExperienceComponent } from './doctor-experience.component';

describe('DoctorExperienceComponent', () => {
  let component: DoctorExperienceComponent;
  let fixture: ComponentFixture<DoctorExperienceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorExperienceComponent]
    });
    fixture = TestBed.createComponent(DoctorExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
