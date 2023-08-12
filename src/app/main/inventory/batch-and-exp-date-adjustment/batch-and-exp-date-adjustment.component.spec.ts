import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchAndExpDateAdjustmentComponent } from './batch-and-exp-date-adjustment.component';

describe('BatchAndExpDateAdjustmentComponent', () => {
  let component: BatchAndExpDateAdjustmentComponent;
  let fixture: ComponentFixture<BatchAndExpDateAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchAndExpDateAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchAndExpDateAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
