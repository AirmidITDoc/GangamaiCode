import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverychallanComponent } from './deliverychallan.component';

describe('DeliverychallanComponent', () => {
  let component: DeliverychallanComponent;
  let fixture: ComponentFixture<DeliverychallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverychallanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverychallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
