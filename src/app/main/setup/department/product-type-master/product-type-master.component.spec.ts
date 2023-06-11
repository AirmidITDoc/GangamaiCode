import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeMasterComponent } from './product-type-master.component';

describe('ProductTypeMasterComponent', () => {
  let component: ProductTypeMasterComponent;
  let fixture: ComponentFixture<ProductTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
