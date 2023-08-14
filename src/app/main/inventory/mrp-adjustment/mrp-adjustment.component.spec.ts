import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MRPAdjustmentComponent } from './mrp-adjustment.component';

describe('MRPAdjustmentComponent', () => {
  let component: MRPAdjustmentComponent;
  let fixture: ComponentFixture<MRPAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MRPAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MRPAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
