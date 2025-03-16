import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGrnComponent } from './new-grn.component';

describe('NewGrnComponent', () => {
  let component: NewGrnComponent;
  let fixture: ComponentFixture<NewGrnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewGrnComponent]
    });
    fixture = TestBed.createComponent(NewGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
