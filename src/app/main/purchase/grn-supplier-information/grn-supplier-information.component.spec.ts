import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnSupplierInformationComponent } from './grn-supplier-information.component';

describe('GrnSupplierInformationComponent', () => {
  let component: GrnSupplierInformationComponent;
  let fixture: ComponentFixture<GrnSupplierInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnSupplierInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnSupplierInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
