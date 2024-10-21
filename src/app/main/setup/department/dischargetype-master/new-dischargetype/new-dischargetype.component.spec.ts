import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDischargetypeComponent } from './new-dischargetype.component';

describe('NewDischargetypeComponent', () => {
  let component: NewDischargetypeComponent;
  let fixture: ComponentFixture<NewDischargetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDischargetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDischargetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
