import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubtapComponent } from './new-subtap.component';

describe('NewSubtapComponent', () => {
  let component: NewSubtapComponent;
  let fixture: ComponentFixture<NewSubtapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSubtapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubtapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
