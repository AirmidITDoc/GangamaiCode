import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySummaryComponent } from './pharmacy-summary.component';

describe('PharmacySummaryComponent', () => {
  let component: PharmacySummaryComponent;
  let fixture: ComponentFixture<PharmacySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
