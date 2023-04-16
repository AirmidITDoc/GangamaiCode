import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashlessDashboardComponent } from './cashless-dashboard.component';

describe('CashlessDashboardComponent', () => {
  let component: CashlessDashboardComponent;
  let fixture: ComponentFixture<CashlessDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashlessDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashlessDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
