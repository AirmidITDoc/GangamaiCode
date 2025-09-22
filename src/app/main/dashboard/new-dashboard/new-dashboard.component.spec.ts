import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDashboardComponent } from './new-dashboard.component';

describe('NewDashboardComponent', () => {
  let component: NewDashboardComponent;
  let fixture: ComponentFixture<NewDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDashboardComponent]
    });
    fixture = TestBed.createComponent(NewDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
