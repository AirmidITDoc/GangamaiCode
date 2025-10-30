import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmenttaskComponent } from './appointmenttask.component';

describe('AppointmenttaskComponent', () => {
  let component: AppointmenttaskComponent;
  let fixture: ComponentFixture<AppointmenttaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmenttaskComponent]
    });
    fixture = TestBed.createComponent(AppointmenttaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
