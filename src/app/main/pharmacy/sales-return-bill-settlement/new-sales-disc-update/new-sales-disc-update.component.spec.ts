import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSalesDiscUpdateComponent } from './new-sales-disc-update.component';

describe('NewSalesDiscUpdateComponent', () => {
  let component: NewSalesDiscUpdateComponent;
  let fixture: ComponentFixture<NewSalesDiscUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewSalesDiscUpdateComponent]
    });
    fixture = TestBed.createComponent(NewSalesDiscUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
