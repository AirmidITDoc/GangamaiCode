import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedeliveryComponent } from './updatedelivery.component';

describe('UpdatedeliveryComponent', () => {
  let component: UpdatedeliveryComponent;
  let fixture: ComponentFixture<UpdatedeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatedeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
