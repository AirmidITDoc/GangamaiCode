import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirmidTimePickerComponent } from './airmid-time-picker.component';

describe('AirmidTimePickerComponent', () => {
  let component: AirmidTimePickerComponent;
  let fixture: ComponentFixture<AirmidTimePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AirmidTimePickerComponent]
    });
    fixture = TestBed.createComponent(AirmidTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
