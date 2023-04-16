import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePaymentListComponent } from './browse-payment-list.component';

describe('BrowsePaymentListComponent', () => {
  let component: BrowsePaymentListComponent;
  let fixture: ComponentFixture<BrowsePaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePaymentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
