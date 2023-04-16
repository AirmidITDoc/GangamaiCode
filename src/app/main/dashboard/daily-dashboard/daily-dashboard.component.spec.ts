import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDashboardComponent } from './daily-dashboard.component';

describe('DailyDashboardComponent', () => {
  let component: DailyDashboardComponent;
  let fixture: ComponentFixture<DailyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
