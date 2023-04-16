import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyDashboardComponent } from './radiology-dashboard.component';

describe('RadiologyDashboardComponent', () => {
  let component: RadiologyDashboardComponent;
  let fixture: ComponentFixture<RadiologyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiologyDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
