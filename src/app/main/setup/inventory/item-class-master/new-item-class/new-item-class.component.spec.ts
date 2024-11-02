import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemClassComponent } from './new-item-class.component';

describe('NewItemClassComponent', () => {
  let component: NewItemClassComponent;
  let fixture: ComponentFixture<NewItemClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewItemClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItemClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
