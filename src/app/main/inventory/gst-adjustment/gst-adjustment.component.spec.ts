import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTAdjustmentComponent } from './gst-adjustment.component';

describe('GSTAdjustmentComponent', () => {
  let component: GSTAdjustmentComponent;
  let fixture: ComponentFixture<GSTAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GSTAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GSTAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
