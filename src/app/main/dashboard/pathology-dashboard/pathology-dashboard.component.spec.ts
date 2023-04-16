import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathologyDashboardComponent } from './pathology-dashboard.component';

describe('PathologyDashboardComponent', () => {
  let component: PathologyDashboardComponent;
  let fixture: ComponentFixture<PathologyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathologyDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathologyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
