import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServicePriceComponent } from './new-service-price.component';

describe('NewServicePriceComponent', () => {
  let component: NewServicePriceComponent;
  let fixture: ComponentFixture<NewServicePriceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewServicePriceComponent]
    });
    fixture = TestBed.createComponent(NewServicePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
