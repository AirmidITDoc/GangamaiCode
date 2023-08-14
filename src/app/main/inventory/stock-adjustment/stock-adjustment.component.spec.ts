import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentComponent } from './stock-adjustment.component';

describe('StockAdjustmentComponent', () => {
  let component: StockAdjustmentComponent;
  let fixture: ComponentFixture<StockAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
