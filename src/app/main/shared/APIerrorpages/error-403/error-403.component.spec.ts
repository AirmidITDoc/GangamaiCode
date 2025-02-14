import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error403Component } from './error-403.component';

describe('Error403Component', () => {
  let component: Error403Component;
  let fixture: ComponentFixture<Error403Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Error403Component]
    });
    fixture = TestBed.createComponent(Error403Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
