import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseRefundListComponent } from './browse-refund-list.component';

describe('BrowseRefundListComponent', () => {
  let component: BrowseRefundListComponent;
  let fixture: ComponentFixture<BrowseRefundListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseRefundListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseRefundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
