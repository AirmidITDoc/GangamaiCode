import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirmidDateTimePickerComponent } from './airmid-date-time-picker.component';

describe('AirmidDateTimePickerComponent', () => {
  let component: AirmidDateTimePickerComponent;
  let fixture: ComponentFixture<AirmidDateTimePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AirmidDateTimePickerComponent]
    });
    fixture = TestBed.createComponent(AirmidDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
